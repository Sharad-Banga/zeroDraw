import axios from "axios";

type Shape = {
    type :"rect";
    x: number;
    y: number;
    width: number;
    height: number; 
  } | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
  }|{
      type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }
  |{
      type: "text";
    content: string;
    startX: number;
    startY: number;
  }|{
        type: "draw";
        points: { x: number; y: number }[];
};

export function initDraw(canvas:HTMLCanvasElement,roomId: string , socket: any , selectedShapeRef:any){
  
  const ctx = canvas?.getContext("2d");
  if(!ctx){
    return;
  }
   
  let existingShapes: Shape[] = [];
  let currentStroke: { x: number; y: number }[] = [];

  let selectedShapeIndex: number | null = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  getExistingShapes(roomId).then((shapes) => {
    existingShapes = shapes;
    clearCanvas(ctx, existingShapes, canvas);
  });
  
  
  if(!socket){
    return;
  }

    socket.onmessage = (e: MessageEvent) => {
      console.log("Message received from server:", e.data);
      const message =  typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      console.log("messageeeeee", message);
      console.log("vvvvvvv", message.message);
      if (message.type === "chat") {
        existingShapes.push(message.message);
        clearCanvas(ctx, existingShapes, canvas);
      }
    };

    let clicked = false;
    let startX = 0;
    let startY = 0;
    let textClicked = false;
    let isPainting = false;
    canvas?.addEventListener("mousedown", (e) => {  
      console.log("mouse downn");
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        if (selectedShapeRef.current === "text") {
          textClicked = true;
          canvas.focus();

          const newTextShape: Shape = {
            type: "text",
            content: "",
            startX: e.clientX,
            startY: e.clientY
          };

          existingShapes.push(newTextShape);
          clearCanvas(ctx, existingShapes, canvas);

          return;
        }

        if (selectedShapeRef.current === "draw") {
            const rect = canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            isPainting = true;
            currentStroke = [{ x: startX, y: startY }];

            ctx.beginPath();
            ctx.moveTo(startX, startY);
          }
    });

     canvas.addEventListener("keydown", (e) => {
      if (!textClicked || selectedShapeRef.current !== "text") return;

      const lastShape = existingShapes[existingShapes.length - 1];
      if (!lastShape || lastShape.type !== "text") return;

      if (e.key === "Enter") {
        textClicked = false;

        socket.send(JSON.stringify({
          type: "chat",
          message: lastShape,
          roomId: roomId
        }));
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        lastShape.content = lastShape.content.slice(0, -1);
      } 
      else if (e.key.length === 1) {
        lastShape.content += e.key;
      }

      clearCanvas(ctx, existingShapes, canvas);
    });


    canvas?.addEventListener("mousemove", (e) => {
        console.log("mouse move", e.clientX, e.clientY);
        if(clicked && selectedShapeRef.current === "rect"){
          const width = e.clientX - startX;
          const height = e.clientY - startY;
          ctx.lineWidth = 1.5;
          clearCanvas(ctx, existingShapes, canvas);
          ctx.strokeStyle = "white";
          ctx.strokeRect(startX, startY, width, height);
        }

        if(clicked && selectedShapeRef.current === "circle"){
          const radius = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2));
          ctx.lineWidth = 1.5;
          clearCanvas(ctx, existingShapes, canvas);
          ctx.strokeStyle = "white";
          ctx.beginPath();
          ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }

        if(clicked && selectedShapeRef.current === "line"){
          const rect = canvas.getBoundingClientRect();
          clearCanvas(ctx, existingShapes, canvas);
          ctx.beginPath();
            // Set a start-point
            ctx.moveTo(startX, startY);
            // Set an end-point
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            // Stroke it (Do the Drawing)
            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.stroke();
        }

        if (isPainting && selectedShapeRef.current === "draw") {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            currentStroke.push({ x, y });

            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.strokeStyle = "white";

            ctx.lineTo(x, y);
            ctx.stroke();
          }
    });



    canvas?.addEventListener("mouseup", (e) => {
      console.log("movee upp");
      const rect = canvas.getBoundingClientRect();


      let shpe: Shape | null = null;
      
      clicked = false;
        if(selectedShapeRef.current === "rect"){
          shpe = {
            type: "rect",
            x: startX,
            y: startY,
            width: e.clientX - startX,
            height: e.clientY - startY
          };
        }

        else if(selectedShapeRef.current === "circle"){
          const radius = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2));
         shpe= {
            type: "circle",
            centerX: startX,
            centerY: startY,
            radius: radius
          };
        }

        else if(selectedShapeRef.current === "line"){
         shpe= {
            type: "line",
            startX: startX,
            startY: startY,
            endX: e.clientX - rect.left,
            endY :e.clientY - rect.top
        };
      }
      
      
      if (selectedShapeRef.current === "draw" && isPainting) {
        
        isPainting = false;

        const shape: Shape = {
          type: "draw",
          points: currentStroke
        };

        existingShapes.push(shape);

        socket.send(
        JSON.stringify({
          type: "chat",
            message: shape,
            roomId: roomId
          })
        );

        ctx.closePath();
      }


    if(!shpe){
      return;
    }
  
    existingShapes.push(shpe);
      console.log("Shape pushed:dddddddddddddddddddddddddddddddd", shpe);
      
      socket.send(JSON.stringify({
        type: "chat",
        message: shpe,
        roomId: roomId
      }));

      console.log("yoyoyoy",existingShapes);
  });
}


function clearCanvas(ctx: CanvasRenderingContext2D, existingShapes: Shape[], canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";  
  ctx.fillRect(0,0,canvas.width, canvas.height);

  existingShapes.map(shape => {
    if(shape.type === "rect"){
      ctx.strokeStyle = "white";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if(shape.type === "circle"){
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
    else if(shape.type === "line"){
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.stroke();
    }
    else if(shape.type === "text"){
      ctx.font = "24px Helvetica, Arial, sans-serif";
      ctx.fillStyle = "white";
      
      ctx.fillText(shape.content, shape.startX, shape.startY);
      
    }
    else if(shape.type === "draw"){
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "white";

      shape.points.forEach((p, index) => {
        if(index === 0){
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      });

      ctx.stroke();
    }
  });
}

async function getExistingShapes(roomId: any) {
  try {
    console.log("Fetching shapes for room:", roomId);
    const res = await axios.get(
      `http://localhost:3001/chats/${roomId}`
          
    );
    const messages = res.data.messages;

    const shapes = messages.map((x: any) =>
      JSON.parse(x.message)
    );
    return shapes;

  } catch (error) {
    console.error("Failed to fetch shapes:", error);
    throw error;
  }
}
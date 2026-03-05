"use client"
import { useEffect, useRef, useState } from 'react'
import { initDraw } from '../draw';

function Canvas({roomId,socket}: any) {


  const [selectedShape , setSelectedShape] = useState("rect");

  const selectedShapeRef = useRef(selectedShape);

      useEffect(() => {
      selectedShapeRef.current = selectedShape;
    }, [selectedShape]);

    const canvasRef =useRef<HTMLCanvasElement>(null);
  
   useEffect(()=>{
    
      if(canvasRef.current){
        console.log("room room room ",roomId);
        initDraw(canvasRef.current,roomId,socket , selectedShapeRef);
      }

  },[roomId,socket])


  
  return (
    <>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        width={1880}
        height={780}
      />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 
        backdrop-blur-2xl h-14 bg-white/10 
        border border-white/20 
        shadow-[0_8px_30px_rgba(0,0,0,0.35)] 
        rounded-2xl px-5 py-3 
        flex gap-4 items-center">

        {/* Rectangle Button */}
        <button
          onClick={() => setSelectedShape("rect")}
          className={`w-10 h-9 flex items-center justify-center 
          text-3xl font-semibold rounded-xl
          transition-all duration-200 ease-out
          ${
            selectedShape === "rect"
              ? "bg-white text-slate-900 scale-105 shadow-lg ring-2 ring-white/70"
              : "text-white hover:bg-white/20 hover:scale-105"
          }`}
        >
          ☐
        </button>

        {/* Circle Button */}
        <button
          onClick={() => setSelectedShape("circle")}
          className={`w-10 h-9 flex items-center justify-center 
          text-6xl  pb-2 rounded-xl
          transition-all duration-200 ease-out
          ${
            selectedShape === "circle"
              ? "bg-white text-slate-900 scale-105 shadow-lg ring-2 ring-white/70"
              : "text-white hover:bg-white/20 hover:scale-105"
          }`}
        >
          ○
        </button>

        {/* Line Button */}
        <button
          onClick={() => setSelectedShape("line")}
          className={`w-10 h-9 flex items-center justify-center 
          text-2xl rounded-xl
          transition-all duration-200 ease-out
          ${
            selectedShape === "line"
              ? "bg-white text-slate-900 scale-105 shadow-lg ring-2 ring-white/70"
              : "text-white hover:bg-white/20 hover:scale-105"
          }`}
        >
          /
        </button>

        {/* Text Button */}
        <button
          onClick={() => setSelectedShape("text")}
          className={`w-10 h-9 flex items-center justify-center 
          text-2xl font-semibold rounded-xl
          transition-all duration-200 ease-out
          ${
            selectedShape === "text"
              ? "bg-white text-slate-900 scale-105 shadow-lg ring-2 ring-white/70"
              : "text-white hover:bg-white/20 hover:scale-105"
          }`}
        >
          A
        </button>



        {/* Draw Button */}
        <button
          onClick={() => setSelectedShape("draw")}
          className={`w-10 h-9 flex items-center justify-center 
          text-2xl font-semibold rounded-xl
          transition-all duration-200 ease-out
          ${
            selectedShape === "draw"
              ? "bg-white text-slate-900 scale-105 shadow-lg ring-2 ring-white/70"
              : "text-white hover:bg-white/20 hover:scale-105"
          }`}
        >
          ✏️
        </button>

      </div>

      
    </>
  )
}

export default Canvas
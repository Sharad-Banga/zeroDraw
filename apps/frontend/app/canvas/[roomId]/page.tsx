
import RoomCanvas from "@/app/components/RoomCanvas";

export default async function Page({ params }: { params: { roomId: string } }) {
  
  const { roomId } = await params;
  
  console.log("aaaaaaaaaa",roomId);

  return <RoomCanvas roomId={roomId} />;
}
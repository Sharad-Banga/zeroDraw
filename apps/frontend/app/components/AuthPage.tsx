"use client";

export function Input({ type, placeholder, value, onChange }: { type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }):React.ReactElement {   
  return (  
    <input
      className="text-black h-10 w-full p-4"
      type={type} 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
} 
export function AuthPage({isSignin}:{isSignin:boolean}) {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="p-6 m-2 bg-white rounded">
        <div>
          {/* <input className="text-black h-10 w-full p-4" type="text" placeholder="Email" />
           */}
           <Input type="text" placeholder="Email" value=""  onChange={(e:any) => console.log(e.target.value)} />
        </div>
        <br />
        <div>
          <Input type="password" placeholder="Password" value=""  onChange={(e:any) => console.log(e.target.value)} />
        </div>
<br />
        <div className="w-full flex justify-center" >
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </div>
        
      </div>
    </div>
  );
}
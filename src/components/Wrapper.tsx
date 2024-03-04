interface props {
  children: React.ReactNode;
  className: string
}

export default function Wrapper({ children, className }: props){
  return (
    <div className={`flex flex-col items-center justify-center w-screen h-screen ${className}`}>
      {children}
    </div>
  );
}
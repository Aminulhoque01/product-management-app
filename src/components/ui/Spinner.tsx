export default function Spinner() {
  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-0"></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-150"></div>
      <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-300"></div>
    </div>
  );
}

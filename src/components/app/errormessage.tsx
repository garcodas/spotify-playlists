// src/components/ErrorMessage.jsx

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div
      className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <svg
        className="w-6 h-6 fill-current mr-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M10 15h-1v-1h1v1zm0-3h-1V7h1v5zM18.002 4.93l-8-3c-.304-.114-.633-.114-.936 0l-8 3c-.546.204-.808.818-.604 1.364.204.546.818.808 1.364.604L10 5.75l7.278 2.872c.182.071.374.104.564.104.386 0 .764-.154 1.043-.438.424-.444.478-1.139.106-1.606-.235-.292-.602-.43-.946-.384z" />
      </svg>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;

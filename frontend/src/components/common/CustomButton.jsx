const CustomButton = ({ title, classes, fnc }) => {
  return (
    <button
      className={`hover:cursor-pointer hover:bg-violet-400 hover:transition-colors hover:duration-300 hover:ease-in-out ${classes}`}
      onClick={fnc}
    >
      {title}
    </button>
  );
};

export default CustomButton;

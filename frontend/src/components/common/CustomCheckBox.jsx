const CustomCheckBox = ({ id, value, label, checked, onChange }) => {
  return (
    <div className="flex items-center ps-3">
      <input
        checked={checked}
        id={id + "_" + value}
        type="checkbox"
        value={value}
        onChange={onChange}
        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
      />
      <label
        htmlFor={id + "_" + value}
        className={`${
          label == "Bilingua" ? "line-through" : ""
        } flex items-center m-2 text-xs font-medium text-gray-500`}
      >
        {label}
      </label>
    </div>
  );
};

export default CustomCheckBox;

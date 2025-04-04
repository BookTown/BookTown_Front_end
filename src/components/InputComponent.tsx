interface IInput {
  id: string;
  label: string;
  type: string;
  register?: any;
  required?: boolean;
}

const InputComponent = ({ id, label, type, register, required }: IInput) =>{
  return (
    <>
        <input
          id={id}
          placeholder={label}
          type={type}
          className="w-full h-[40px] px-4 rounded-full bg-white shadow-[4px_4px_8px_rgba(0,0,0,0.25)] placeholder:text-[#A39C9C]"
          {...register(id, { required: true })}
        />
    </>
  );
}

export default InputComponent;
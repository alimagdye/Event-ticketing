function OTPInput({ otp, inputsRef, handleChange, handleKeyDown }) {
  return (
    <div className="flex justify-center gap-3 mb-10 transition duration-500">
      {otp.map((value, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          value={value}
          ref={(el) => (inputsRef.current[i] = el)}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-10 h-10 sm:w-16 sm:h-16 lg:text-2xl text-center rounded-md border border-primary bg-purple-100 focus:outline-none focus:ring-2 focus:ring-primary transition duration-500"
        />
      ))}
    </div>
  );
}

export default OTPInput;

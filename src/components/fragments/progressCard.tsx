export default function ProgressCard() {
  return (
    <>
      <div className="w-96 h-72 bg-[#ADC6E5] p-4 rounded-2xl shadow-2xl ">
        <h1 className="text-lg font-bold">Lorem Progress</h1>
        <div className="flex mt-4">
          <div className="w-16 h-16 bg-red-400 rounded-full"></div>
          <div className="flex flex-col w-3/4 h-14  pl-4">
            <h1 className="font-semibold">Lorem Ipsum</h1>
            <h1>Level 2 </h1>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex flex-row gap-x-4 w-full h-20 ">
            <div className="w-1/2 bg-[#9D9595]  text-white rounded-xl p-2 font-semibold">
              Total Exp
            </div>
            <div className="w-1/2 bg-[#9D9595] text-white rounded-xl p-2 font-semibold">
              Rank
            </div>
          </div>
          <div className="flex w-full mt-4 ">
            <button className="bg-red-400 rounded-3xl w-full h-10 text-white font-bold">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

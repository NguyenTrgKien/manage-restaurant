function Stats({ stats }) {
  const cols = `grid-cols-${stats.length}`;
  return (
    <div className={`grid ${cols} gap-[1.2rem]`}>
      {stats.map((item, index) => {
        return (
          <div
            key={index}
            className="bg-gray-100 shadow-sm rounded-[.8rem] p-[1.4rem]"
          >
            <p className="text-[1.6rem] text-gray-500 mb-[.6rem]">
              {item.title}
            </p>
            <p className={`text-[2.5rem] font-semibold ${item.color}`}>
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default Stats;

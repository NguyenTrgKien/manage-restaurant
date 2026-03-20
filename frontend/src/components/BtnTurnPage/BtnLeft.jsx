import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BtnLeft({ left }) {
  return (
    <div
      className={`absolute top-[50%] translate-y-[-50%]`}
      style={{ left: left }}
    >
      <div className="w-[6rem] h-[6rem] flex justify-center items-center rounded-[50%] bg-[#c1c1c18b] hover:scale-[1.15] hv-linear hover:border-[.1rem] border-[.1rem] border-[transparent] hover:border-[#00dd00] ">
        <FontAwesomeIcon
          icon={faAngleLeft}
          className="text-primary text-[2.5rem]"
        />
      </div>
    </div>
  );
}

export default BtnLeft;

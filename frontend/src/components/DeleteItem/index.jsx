import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DeleteItem({item,itemName, handleShowDelete, handleDelete}) {

    return ( 
        <div className="fixed inset-0 flex justify-center items-center z-[200] bg-[#4e4e4e4b]">
            <div className="w-auto h-auto relative bg-[#fff] rounded-[1rem] p-[5rem]">
                <FontAwesomeIcon icon={faXmark} className="text-[1.8rem] absolute top-[1rem] right-[1rem] p-[.5rem] bg-[#e6e6e6] text-[#767676] rounded-[.5rem]"
                    onClick={() => handleShowDelete(null)}
                /> 
                <div className="text-[2rem] font-bold">
                    Bạn có chắc muốn xóa {itemName} này
                </div>
                <div className="flex items-center gap-[1.5rem] justify-center mt-[2rem]">
                    <button className="px-[2rem] py-[1rem] bg-[#e7e7e7] rounded-[.8rem] hover:opacity-[.8] cursor-pointer" 
                        onClick={() => handleDelete(item)}
                    >Có</button>
                    <button className="px-[2rem] py-[1rem] bg-[#ff3a3a] text-[#fff] rounded-[.8rem] hover:opacity-[.8] cursor-pointer"
                        onClick={() => handleShowDelete(null)}
                    >Không</button>
                </div>
            </div>
        </div>
     );
}

export default DeleteItem;
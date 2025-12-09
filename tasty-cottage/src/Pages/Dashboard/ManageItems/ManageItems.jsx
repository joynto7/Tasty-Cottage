import { FaEdit, FaTrash } from "react-icons/fa";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import useMenu from "../../../hooks/useMenu";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageItems = () => {
  const [menu, refetch] = useMenu();
  const axiosSecure = useAxiosSecure();

  
  
 
 
 
 
 

  const handleDeleteItem = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/menu/${item._id}`);
          console.log("Delete response:", res.data);

          
          if (res.data.deletedCount > 0) { 
            refetch();
            Swal.fire({
              position: "top",
              icon: "success",
              title: `${item.name} has been deleted`,
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire("Error", "Item not deleted. Try again!", "error");
          }
        } catch (err) {
          Swal.fire("Error", "Delete request failed!", "error");
          console.error(err);
        }
      }
    });
  };

  return (
    <div>
      <SectionTitle heading="Manage Items" subHeading="Hurry Up" />

      <div className="overflow-x-auto p-4">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Image</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {menu.map((item, index) => (
              <tr key={item._id}>
                <th>{index + 1}</th>

                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={item.image} alt={item.name} />
                      </div>
                    </div>
                  </div>
                </td>

                <td>{item.name}</td>
                {}
                <td>${item.price?.toFixed(2) || item.price}</td> 

                <td>
                  {}
                  <button
                  
                    className="btn-ghost px-4 py-2 rounded-lg text-md font-semibold 
                               flex items-center justify-center space-x-2 
                               transition-all duration-300 ease-in-out
                               bg-orange-600 hover:bg-orange-700
                               text-white shadow-lg hover:shadow-xl hover:scale-[1.03]"
                  >
                    <FaEdit className="text-white" />
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="btn btn-ghost btn-lg"
                  >
                    <FaTrash className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageItems;
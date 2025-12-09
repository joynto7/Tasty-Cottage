import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaTrashAlt, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";


const AllUsers = () => {

    const axiosSecure = useAxiosSecure();

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    })


    const handleMakeAdmin = user => {
        axiosSecure.patch(`/users/admin/${user._id}`)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user.name} is the Admin Now !`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .catch(error => { 
                console.error("Failed to make admin:", error);
                Swal.fire({ icon: "error", title: "Update Failed", text: "Could not set user as admin." });
            });
    }


    const handleDeleteUser = user => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/users/${user._id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: `${user.name} has been deleted.`,
                                icon: "success"
                            });
                        }
                    })
                    .catch(error => { 
                        console.error("Failed to delete user:", error);
                        Swal.fire({ icon: "error", title: "Deletion Failed", text: "Could not delete the user." });
                    });
            }
        });
    }

    return (

        <div>
            <div className="flex justify-evenly my-4">
                <h2 className="text-3xl">All Users</h2> {}
                <h2 className="text-3xl">Total Users: {users.length}</h2>
            </div>


            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                   { user.role === 'admin' ? 'Admin' : <button
                                        onClick={() => handleMakeAdmin(user)}
                                        className="px-4 py-2 rounded-lg text-lg font-semibold 
                                          flex items-center justify-center space-x-2 
                                          transition-all duration-300 ease-in-out
                                          bg-orange-600 hover:bg-orange-700
                                          text-white shadow-lg hover:shadow-xl hover:scale-[1.03]"> 
                                        <FaUsers className="text-white text-xl"></FaUsers>
                                    </button>}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="p-3 rounded-lg transition-colors duration-200 hover:bg-orange-100"> 
                                        <FaTrashAlt className="text-orange-600"></FaTrashAlt>
                                    </button>
                                </td>
                            </tr>)
                        }


                    </tbody>
                </table>
            </div>
        </div>

    );

};

export default AllUsers;
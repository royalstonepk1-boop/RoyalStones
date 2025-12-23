import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import PageWrapper from "../util/PageWrapper";
import { toast } from 'react-toastify';

export default function Profile() {
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);

    const [activeTab, setActiveTab] = useState("profile");
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const [profileForm, setProfileForm] = useState({
        name: user.name,
        email: user.email,
    });

    const [addressForm, setAddressForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Pakistan",
        isDefault: false
    });

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setAddressForm({ ...addressForm, [e.target.name]: value });
    };

    const handleSaveProfile = () => {
        updateUser(profileForm);
        setIsEditingProfile(false);
        toast.success("Profile updated successfully!", {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
    };

    const handleAddAddress = () => {
        updateUser({ addresses: [...user.addresses, addressForm] });
        setAddressForm({
            fullName: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            country: "Pakistan",
            isDefault: false
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        setIsAddingAddress(false);
        toast.success("Address added successfully!", {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });

    };

    const handleEditAddress = (address) => {
        setEditingAddress(address._id);
        setAddressForm(address);
    };

    const handleUpdateAddress = () => {
        const updatedAddresses = user?.addresses?.map(addr =>
            addr._id === editingAddress ? { ...addressForm, _id: addr._id } : addr
        );
        updateUser({ ...user, addresses: updatedAddresses });
        setEditingAddress(null);
        setAddressForm({
            fullName: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            country: "Pakistan",
            isDefault: false
        });
        toast.success("Address updated successfully!", {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
        
    };

    const handleDeleteAddress = (addressId) => {
        toast.warning(
            ({ closeToast }) => (
              <div>
                <p className="mb-3">Are you sure you want to delete this address?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const updatedAddresses = user.addresses.filter(addr => addr._id !== addressId);
                      updateUser({ addresses: updatedAddresses });
                      closeToast();
                      toast.success("Address deleted successfully!", {
                        position: "top-right",
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                      });
                    }}
                    className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Delete
                  </button>
                  <button
                    onClick={closeToast}
                    className="bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ),
            {
              position: "top-center",
              autoClose: false,
              closeButton: false,
              draggable: false,
            }
          );
    };

    const handleSetDefaultAddress = (addressId) => {
        const updatedAddresses = user.addresses.map(addr => ({
            ...addr,
            isDefault: addr._id === addressId
        }));
        updateUser({ addresses: updatedAddresses });
        toast.success("Default address updated!", {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <PageWrapper>
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-400 rounded-lg p-6 mb-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500 w-20 h-20 rounded-full flex items-center justify-center text-gray-900 text-3xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">{user?.name}</h1>
                            <p className="text-gray-400">{user?.email}</p>
                            <div className="flex gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user?.role === 'admin' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                    }`}>
                                    {user?.role.toUpperCase()}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                                    Member since {formatDate(user.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex-1 py-4 px-6 font-medium transition-colors cursor-pointer ${activeTab === "profile"
                                ? "bg-amber-500 text-gray-900"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <i className="bi bi-person-circle mr-2"></i>
                            Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab("addresses")}
                            className={`flex-1 py-4 px-6 font-medium transition-colors cursor-pointer ${activeTab === "addresses"
                                ? "bg-amber-500 text-gray-900"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <i className="bi bi-geo-alt mr-2"></i>
                            Addresses ({user?.addresses.length})
                        </button>
                        {/* <button
                            onClick={() => setActiveTab("security")}
                            className={`flex-1 py-4 px-6 font-semibold transition-colors cursor-pointer ${activeTab === "security"
                                ? "bg-amber-500 text-gray-900"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <i className="bi bi-shield-lock mr-2"></i>
                            Security
                        </button> */}
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                {!isEditingProfile && (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="bg-amber-500 hover:bg-amber-600 cursor-pointer text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        <i className="bi bi-pencil mr-2 text-sm"></i>
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {isEditingProfile ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileForm.name}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileForm.email}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="bg-green-500 hover:bg-green-600 cursor-pointer text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingProfile(false);
                                                setProfileForm({ name: user?.name, email: user?.email, phone: user?.phone });
                                            }}
                                            className="bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <label className="text-gray-500 text-sm">Full Name</label>
                                        <p className="text-gray-900 font-semibold text-lg">{user?.name}</p>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <label className="text-gray-500 text-sm">Email Address</label>
                                        <p className="text-gray-900 font-semibold text-lg">{user?.email}</p>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <label className="text-gray-500 text-sm">Phone Number</label>
                                        <p className="text-gray-900 font-semibold text-lg">{user?.addresses?.filter(u => u.isDefault)[0]?.phone}</p>
                                    </div>
                                    {
                                        user?.role === "admin" &&
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <label className="text-gray-500 text-sm">Account Role</label>
                                            <p className="text-gray-900 font-semibold text-lg capitalize">{user?.role}</p>
                                        </div>
                                    }
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <label className="text-gray-500 text-sm">Member Since</label>
                                        <p className="text-gray-900 font-semibold text-lg">{formatDate(user?.createdAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === "addresses" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                                {
                                    user?.addresses.length < 2 &&
                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="bg-amber-500 hover:bg-amber-600 cursor-pointer text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors"
                                    >
                                        <i className="bi bi-plus-circle mr-2"></i>
                                        Add New Address
                                    </button>
                                }
                            </div>

                            {/* Add/Edit Address Form */}
                            {(isAddingAddress || editingAddress) && (
                                <div className="bg-gray-50 border-2 border-amber-500 rounded-lg p-6 mb-6">
                                    <h3 className="text-xl font-bold mb-4">
                                        {editingAddress ? "Edit Address" : "Add New Address"}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={addressForm.fullName}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={addressForm.phone}
                                                onChange={handleAddressChange}
                                                maxLength={11}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-gray-700 font-semibold mb-2">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={addressForm.address}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={addressForm.city}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={addressForm.state}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Postal Code</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={addressForm.postalCode}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={addressForm.country}
                                                onChange={handleAddressChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>
                                        {
                                            user?.addresses?.some(u => u.isDefault) ? '' :
                                            <div className="md:col-span-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="isDefault"
                                                    checked={addressForm.isDefault}
                                                    onChange={handleAddressChange}
                                                    className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                                                />
                                                <span className="text-gray-700 font-semibold">Set as default address</span>
                                            </label>
                                        </div>
                                        }
                                        
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                                            className="bg-green-500 hover:bg-green-600 cursor-pointer text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                                        >
                                            {editingAddress ? "Update Address" : "Add Address"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsAddingAddress(false);
                                                setEditingAddress(null);
                                                setAddressForm({
                                                    fullName: "",
                                                    phone: "",
                                                    address: "",
                                                    city: "",
                                                    state: "",
                                                    postalCode: "",
                                                    country: "Pakistan",
                                                    isDefault: false
                                                });
                                            }}
                                            className="bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Address List */}
                            {
                                isAddingAddress || editingAddress ? null : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user?.addresses.map((address) => (
                                            <div
                                                key={address?._id}
                                                className={`border-2 rounded-lg p-4 ${address.isDefault ? "border-amber-500 bg-amber-50" : "border-gray-200"
                                                    }`}
                                            >
                                                {address?.isDefault && (
                                                    <span className="bg-amber-500 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold mb-3 inline-block">
                                                        DEFAULT ADDRESS
                                                    </span>
                                                )}
                                                <h3 className="font-bold text-lg text-gray-900">{address?.fullName}</h3>
                                                <p className="text-gray-600 mt-2">{address?.address}</p>
                                                <p className="text-gray-600">{address?.city}, {address?.state} {address?.postalCode}</p>
                                                <p className="text-gray-600">{address?.country}</p>
                                                <p className="text-gray-600 mt-2">
                                                    <i className="bi bi-telephone mr-2"></i>
                                                    {address?.phone}
                                                </p>
                                                <div className="flex gap-2 mt-4">
                                                    <button
                                                        onClick={() => handleEditAddress(address)}
                                                        className="flex-1 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                    >
                                                        <i className="bi bi-pencil mr-1"></i>
                                                        Edit
                                                    </button>
                                                    {!address.isDefault && (
                                                        <>
                                                            <button
                                                                onClick={() => handleSetDefaultAddress(address._id)}
                                                                className="flex-1 bg-amber-500 hover:bg-amber-600 cursor-pointer text-gray-900 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                            >
                                                                Set Default
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAddress(address._id)}
                                                                className="bg-red-500 hover:bg-red-600 text-white cursor-pointer px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </>
                                                    )}

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }


                            {user?.addresses?.length === 0 && !isAddingAddress && (
                                <div className="text-center py-12">
                                    <i className="bi bi-geo-alt text-6xl text-gray-400"></i>
                                    <p className="text-gray-500 mt-4">No addresses saved yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Security Tab */}
                    {/* {activeTab === "security" && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="font-bold text-lg mb-2">Change Password</h3>
                                    <p className="text-gray-600 mb-4">Update your password to keep your account secure</p>
                                    <button className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors">
                                        Change Password
                                    </button>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="font-bold text-lg mb-2">Two-Factor Authentication</h3>
                                    <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                                    <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                        Enable 2FA
                                    </button>
                                </div>
                                <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                                    <h3 className="font-bold text-lg mb-2 text-red-700">Delete Account</h3>
                                    <p className="text-gray-600 mb-4">Permanently delete your account and all associated data</p>
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
        </PageWrapper>
    );
}
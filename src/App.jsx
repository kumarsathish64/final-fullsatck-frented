import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Buffer } from "buffer";

const App = () => {
  const API_URL = "https://final-fullstack-projects.vercel.app/api/subjects";

  const [form, setForm] = useState({
    course: "",
    bookname: "",
    author: "",
    edition: "",
    price: 0,
    description: "",
    image: null,
    preview: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch subjects from API
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(API_URL);
      const updatedSubjects = response.data.map((subject) => {
        if (subject.image && subject.image.data) {
          const base64Image = `data:${subject.contentType};base64,${Buffer.from(
            subject.image.data
          ).toString("base64")}`;
          return { ...subject, image: base64Image };
        }
        return subject;
      });
      setSubjects(updatedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("course", form.course);
      formData.append("bookname", form.bookname);
      formData.append("author", form.author);
      formData.append("edition", form.edition);
      formData.append("price", form.price);
      formData.append("description", form.description);
      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setForm({
        course: "",
        bookname: "",
        author: "",
        edition: "",
        price: 0,
        description: "",
        image: null,
        preview: "",
      });
      fetchSubjects();
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setForm({ ...form, image: file, preview: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle editing a subject
  const editSubject = (subject) => {
    setForm({
      course: subject.course,
      bookname: subject.bookname,
      author: subject.author,
      edition: subject.edition,
      price: subject.price,
      description: subject.description,
      image: null,
      preview: subject.image,
    });
    setEditingId(subject._id);
  };

  // Handle deleting a subject
  const deleteSubject = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSubjects(subjects.filter((subj) => subj._id !== id));
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-6 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Course Management System</h1>
          <p className="text-lg mt-2">Manage your courses and resources with ease</p>
        </div>
      </header>

      <main className="container mx-auto p-6 flex-grow">
        {/* About Section */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-3xl font-bold text-center mb-4">About Us</h2>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <img
              src="https://tse1.mm.bing.net/th?id=OIP.2YQMX8zBbYbih-L8h5fb4wHaE8&pid=Api&P=0&h300/300"
              alt="About Us"
              className="w-full lg:w-1/3 rounded-lg shadow-md"
            />
            <p className="text-lg leading-relaxed text-gray-700 lg:w-2/3">
              Welcome to our Course Management System. We specialize in providing a wide range of courses and educational resources to help students excel in their academic journeys. Explore our curated collection of books and courses designed to empower and inspire learners of all levels.
            </p>
          </div>
        </section>

        {/* Course Management Section */}
        <section className="bg-gray-200 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-3xl font-bold text-center mb-4">Add or Edit Courses</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Course Name"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              placeholder="Book Name"
              value={form.bookname}
              onChange={(e) => setForm({ ...form, bookname: e.target.value })}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              placeholder="Edition"
              value={form.edition}
              onChange={(e) => setForm({ ...form, edition: e.target.value })}
              className="input input-bordered w-full"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input input-bordered w-full"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
            {form.preview && (
              <img
                src={form.preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg mx-auto mt-4"
              />
            )}
            <button type="submit" className="btn btn-primary w-full col-span-full">
              {editingId ? "Update Course" : "Add Course"}
            </button>
          </form>
        </section>

        {/* Course Display Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-4">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div key={subject._id} className="card bg-gray-100 shadow-md">
                <img
                  src={subject.image || "https://tse4.mm.bing.net/th?id=OIP.CGEfBMBIYoz4Syk_3B8DawHaEK&pid=Api&P=0&h=180"}
                  alt={subject.course}
                  className="w-50 h-48 object-cover c  "
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{subject.course}</h3>
                  <p className="text-sm text-gray-600">{subject.bookname}</p>
                  <p className="text-sm text-gray-600">{subject.author}</p>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => editSubject(subject)}
                      className="btn btn-sm btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSubject(subject._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} Course Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import { Buffer } from 'buffer';
// import 'daisyui/dist/full.css';

// const App = () => {
//   const API_URL = "https://upoad-image-db.vercel.app/api/product";

//   const [form, setForm] = useState({
//     prd_name: '',
//     prd_price: 0,
//     prd_desc: '',
//     image: null,
//     preview: ''
//   });
//   const [products, setProducts] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [toast, setToast] = useState('');

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(API_URL);
//       const updatprods = response.data.map((product) => {
//         if (product.image && product.image.data) {
//           const base64Image = `data:image/jpeg;base64,${Buffer.from(
//             product.image.data
//           ).toString('base64')}`;
//           return { ...product, image: base64Image };
//         }
//         return product;
//       });
//       setProducts(updatprods);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('prd_name', form.prd_name);
//       formData.append('prd_price', form.prd_price);
//       formData.append('prd_desc', form.prd_desc);
//       if (form.image) {
//         formData.append('image', form.image);
//       }

//       if (editingId) {
//         await axios.put(`${API_URL}/${editingId}`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         setToast('Product updated successfully!');
//         setEditingId(null);
//       } else {
//         await axios.post(API_URL, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         setToast('Product created successfully!');
//       }

//       setForm({ prd_name: '', prd_price: 0, prd_desc: '', image: null, preview: '' });
//       fetchProducts();
//     } catch (error) {
//       setToast('Error submitting form. Please try again.');
//       console.error("Error submitting form:", error.response?.data || error.message);
//     }
//   };

//   const deleteProduct = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       setProducts(products.filter((p) => p._id !== id));
//       setToast('Product deleted successfully!');
//     } catch (error) {
//       setToast('Error deleting product.');
//       console.error("Error deleting product:", error);
//     }
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         setForm({ ...form, image: file, preview: reader.result });
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const editProduct = (product) => {
//     setForm({
//       prd_name: product.prd_name,
//       prd_price: product.prd_price,
//       prd_desc: product.prd_desc,
//       image: null,
//       preview: product.image,
//     });
//     setEditingId(product._id);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="navbar bg-blue-600 text-white px-4">
//         <div className="navbar-start">
//           <a href="/" className="text-2xl font-bold">Product Manager</a>
//         </div>
//         <div className="navbar-center hidden lg:flex">
//           <ul className="menu menu-horizontal p-0">
//             <li><a href="#home" className="hover:text-gray-300">Home</a></li>
//             <li><a href="#about" className="hover:text-gray-300">About</a></li>
//             <li><a href="#contact" className="hover:text-gray-300">Contact</a></li>
//           </ul>
//         </div>
//         <div className="navbar-end">
//           <button className="btn btn-sm btn-secondary">Login</button>
//         </div>
//       </nav>

//       {/* Body */}
//       <div className="p-4 bg-gray-100 min-h-screen">
//         <div id="home" className="max-w-6xl mx-auto">
//           <h1 className="text-4xl font-bold text-center mb-6">Manage Your Products</h1>

//           {/* Toast */}
//           {toast && (
//             <div className="toast toast-top toast-center">
//               <div className="alert alert-info">{toast}</div>
//             </div>
//           )}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-2xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
//             <div className="mb-4">
//               <input
//                 type="text"
//                 placeholder="Product Name"
//                 value={form.prd_name}
//                 onChange={(e) => setForm({ ...form, prd_name: e.target.value })}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <input
//                 type="number"
//                 placeholder="Price"
//                 value={form.prd_price}
//                 onChange={(e) => setForm({ ...form, prd_price: e.target.value })}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <textarea
//                 placeholder="Description"
//                 value={form.prd_desc}
//                 onChange={(e) => setForm({ ...form, prd_desc: e.target.value })}
//                 required
//                 className="textarea textarea-bordered w-full"
//               />
//             </div>
//             <div className="mb-4">
//               <input type="file" onChange={handleFileChange} className="file-input file-input-bordered w-full" />
//             </div>
//             {form.preview && (
//               <div className="mb-4">
//                 <img
//                   src={form.preview}
//                   alt="Preview"
//                   className="w-24 h-24 object-cover rounded-lg"
//                 />
//               </div>
//             )}
//             <button type="submit" className="btn btn-primary w-full">
//               {editingId ? 'Update Product' : 'Create Product'}
//             </button>
//           </form>

//           {/* Product Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product) => (
//               <div
//                 key={product._id}
//                 className="card bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
//               >
//                 <figure>
//                   <img
//                     src={product.image}
//                     alt={product.prd_name}
//                     className="w-full h-48 object-cover rounded-t-lg"
//                   />
//                 </figure>
//                 <div className="card-body">
//                   <h3 className="card-title">{product.prd_name}</h3>
//                   <p className="text-gray-700">Price: ${product.prd_price}</p>
//                   <p className="text-gray-500">{product.prd_desc}</p>
//                   <p className="text-sm text-gray-400">Uploaded: {dayjs(product.uploadedAt).format('DD/MM/YYYY')}</p>
//                   <div className="card-actions justify-end">
//                     <button
//                       onClick={() => editProduct(product)}
//                       className="btn btn-secondary btn-sm"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => deleteProduct(product._id)}
//                       className="btn btn-error btn-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* About Section */}
//         <div id="about" className="max-w-6xl mx-auto py-10">
//           <h2 className="text-3xl font-bold mb-4">About Us</h2>
//           <p className="text-gray-600">This is a product management system where you can add, edit, and delete products effortlessly. Built with React and Tailwind CSS, it is designed for ease of use and functionality.</p>
//         </div>

//         {/* Contact Section */}
//         <div id="contact" className="max-w-6xl mx-auto py-10">
//           <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
//           <p className="text-gray-600">Have questions? Reach out to us via email at <a href="mailto:support@example.com" className="text-blue-500 underline">support@example.com</a>.</p>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white text-center p-4">
//         <p>&copy; 2024 Product Manager. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default App;

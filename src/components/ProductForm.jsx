"use client"

import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        colors: [],
        sizes: [],
        images: [],
    });
    const [imageUrls, setImageUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = async (e) => {
        try {
            setIsUploading(true);
            const files = e.target.files;
            const newImageUrls = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append("image", file);
                const response = await axios.post("/api/upload", formData);
                newImageUrls.push(response.data.url);
            }

            setImageUrls([...imageUrls, ...newImageUrls]);
            setIsUploading(false);
            console.log(imageUrls)

        } catch (error) {
            console.error('Failed to save the images.', error);
            setIsUploading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const colorsArray = productData.colors.split(',');
            const sizesArray = productData.sizes.split(',');

            console.log(imageUrls)

            const dataToSubmit = {
                ...productData,
                colors: colorsArray,
                sizes: sizesArray,
                images: imageUrls
            };

            const url = '/api/products';

            const response = await axios.post(url, dataToSubmit);

            if (response.data && response.data._id) {
                console.log('Product created successfully!');
            }
        } catch (error) {
            console.error('Failed to create product.', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='input-bx'>
                <label>Name:</label>
                <input type="text" name="name" value={productData.name} onChange={handleInputChange} />
            </div>

            <div className='input-bx'>
                <label>Description:</label>
                <textarea name="description" value={productData.description} onChange={handleInputChange} />
            </div>

            <div className='input-bx'>
                <label>Price:</label>
                <input type="number" name="price" value={productData.price} onChange={handleInputChange} />
            </div>

            <div className='input-bx'>
                <label>Category:</label>
                <input type="text" name="category" value={productData.category} onChange={handleInputChange} />
            </div>

            <div className='input-bx'>
                <label>Colors:</label>
                <input type="text" name="colors" value={productData.colors} onChange={handleInputChange} />
            </div>

            <div className='input-bx'>
                <label>Sizes:</label>
                <input type="text" name="sizes" value={productData.sizes} onChange={handleInputChange} />
            </div>

            <div className='input-bx'>
                <label>Images:</label>
                <input type="file" name="images" multiple onChange={handleImageChange} disabled={isUploading}/>
            </div>

            <div className="image-preview-container">
                {imageUrls.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`Image ${index}`}
                        className="image-preview"
                    />
                ))}
            </div>
            {isUploading && <p>Uploading images...</p>}
            <button type="submit" disabled={isUploading}>Create Product</button>
        </form>
    );
};

export default ProductForm;
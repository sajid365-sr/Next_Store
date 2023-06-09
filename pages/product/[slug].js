/** @format */

import { useStateContext } from "../../context/StateContext";
import { Products } from "../../components";
import { client, urlFor } from "../../lib/client";
import React, { useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

const ProductDetails = ({ product, similarProducts }) => {
  const { image, name, details, price } = product;

  const [index, setIndex] = useState(0);
  const { incQty, decQty, qty, onAdd, setShowCard } = useStateContext();

  const handleBuyNow = async () => {
    onAdd(product, qty);
    setShowCard(true);
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              className="product-detail-image"
              alt=""
            />
          </div>

          {/* =================== SMALL IMAGES =================== */}
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
                src={urlFor(item)}
                alt=""
              />
            ))}
          </div>
        </div>

        {/* =================== PRODUCT DETAILS ================ */}
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className="quantity">
            <h3>Quantity: </h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => onAdd(product, qty)}
            >
              Add to Cart
            </button>
            <button onClick={handleBuyNow} type="button" className="buy-now">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* =================== YOU MAY LIKE PRODUCT ================== */}
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {similarProducts.map((item, i) => (
              <Products key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
        slug {
            current
        }
    }`;

  const products = await client.fetch(query);
  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const individualProductQuery = `*[_type == "product" && slug.current == '${slug}'][0]`;

  const similarProductQuery = `*[_type == "product"]`;

  const product = await client.fetch(individualProductQuery);
  const similarProducts = await client.fetch(similarProductQuery);

  return {
    props: { product, similarProducts },
  };
};

export default ProductDetails;

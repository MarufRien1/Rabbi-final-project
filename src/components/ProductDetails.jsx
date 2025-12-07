import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function ProductDetails() {
  const { id } = useParams();

  const product = products.find((p) => p.id === parseInt(id));

  // ⭐ Get related products by same category
  const related = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Selected Product */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-10">
        <img
          src={product.img}
          alt={product.title}
          className="w-full h-72 object-cover rounded-xl"
        />

        <h2 className="text-3xl font-bold mt-5">{product.title}</h2>

        <p className="text-green-700 font-semibold text-xl mt-1">
          Price: ${product.price}
        </p>

        <p className="mt-2 text-slate-800">
          <b>Weight:</b> {product.weight}
        </p>
        <p className="mt-1 text-slate-800">
          <b>Origin:</b> {product.origin}
        </p>
        <p className="mt-1 text-slate-800">
          <b>Freshness:</b> {product.freshness}
        </p>
        <p className="mt-1 text-slate-800">
          <b>Rating:</b> ⭐ {product.rating}
        </p>
        <p className="mt-1 text-slate-800">
          <b>Stock:</b> {product.stock}
        </p>

        <p className="mt-4 text-slate-700">{product.description}</p>

        <button className="mt-5 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700">
          Add to Cart
        </button>
      </div>

      {/* ⭐ Related Products by Same Category */}
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">More in {product.category}</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow border overflow-hidden"
            >
              <img
                src={p.img}
                alt={p.title}
                className="h-32 w-full object-cover"
              />

              <div className="p-3">
                <p className="font-semibold">{p.title}</p>
                <p className="text-green-700 font-bold">${p.price}</p>

                <Link
                  to={`/product/${p.id}`}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800"
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { getAllVisitsData } from '@/app/utils/visitCounter';
import { getAllProducts } from '@/app/data/database';

export default async function VisitsAdminPage() {
  const visitsData = getAllVisitsData();
  const products = await getAllProducts();
  
  // Create a map of product IDs to names for easier reference
  const productMap = products.reduce((acc, product) => {
    // Handle both string and object name types
    const productName = typeof product.name === 'string' 
      ? product.name 
      : product.name.en || product.name.es || product.id;
    acc[product.id] = productName;
    return acc;
  }, {} as Record<string, string>);
  
  // Sort products by visit count (descending)
  const sortedProducts = Object.entries(visitsData)
    .sort(([, a], [, b]) => b.count - a.count);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Visit Statistics</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visit Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Visited
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.map(([productId, data]) => (
              <tr key={productId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {productMap[productId] || productId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{data.count}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(data.lastVisited).toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useApp } from '../context/AppContext';

const { FiPlus, FiClock, FiDollarSign } = FiIcons;

const Menu = () => {
  const { state, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuItems, setMenuItems] = useState([]);

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  // Sample menu data - in real app, this would come from admin
  useEffect(() => {
    const sampleMenu = [
      {
        id: 1,
        name: 'Classic Pancakes',
        category: 'Breakfast',
        price: 649.99,
        description: 'Fluffy pancakes with maple syrup and butter',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        available: true,
        prepTime: 15
      },
      {
        id: 2,
        name: 'Avocado Toast',
        category: 'Breakfast',
        price: 499.99,
        description: 'Fresh avocado on sourdough with tomatoes',
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        available: true,
        prepTime: 10
      },
      {
        id: 3,
        name: 'Grilled Chicken Bowl',
        category: 'Lunch',
        price: 799.99,
        description: 'Grilled chicken with quinoa and vegetables',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        available: true,
        prepTime: 20
      },
      {
        id: 4,
        name: 'Caesar Salad',
        category: 'Lunch',
        price: 599.99,
        description: 'Fresh romaine with parmesan and croutons',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        available: true,
        prepTime: 10
      },
      {
        id: 5,
        name: 'Beef Steak',
        category: 'Dinner',
        price: 1249.99,
        description: 'Grilled beef steak with mashed potatoes',
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        available: true,
        prepTime: 30
      },
      {
        id: 6,
        name: 'Salmon Fillet',
        category: 'Dinner',
        price: 999.99,
        description: 'Pan-seared salmon with lemon and herbs',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        available: true,
        prepTime: 25
      },
      {
        id: 7,
        name: 'Chocolate Cookies',
        category: 'Snacks',
        price: 349.99,
        description: 'Homemade chocolate chip cookies',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        available: true,
        prepTime: 5
      },
      {
        id: 8,
        name: 'Fruit Smoothie',
        category: 'Snacks',
        price: 399.99,
        description: 'Mixed fruit smoothie with yogurt',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        available: true,
        prepTime: 5
      }
    ];
    setMenuItems(sampleMenu);
  }, []);

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Today's Fresh Menu
          </h1>
          <p className="text-xl text-gray-600">
            All meals are prepared fresh daily with love and care
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {item.category}
                  </span>
                </div>
                {!item.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Sold Out</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-orange-500">
                      <span className="text-sm">₱</span>
                      <span className="font-semibold">{item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      <span className="text-sm">{item.prepTime} min</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.available}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    item.available
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No items available in this category today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
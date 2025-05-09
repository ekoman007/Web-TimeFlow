import React, { useState, useEffect } from 'react';
import { Service, BusinessCategory } from '@/types';
import axios from '@/services/axiosClient';

interface ServiceSelectionProps {
  onSelect: (service: Service) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onSelect }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<Service[]>('/api/services');
        setServices(response.data);
        setFilteredServices(response.data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(response.data.map(service => service.category))
        );
        setCategories(uniqueCategories as BusinessCategory[]);
      } catch (err: any) {
        setError('Failed to load services. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on category and search term
  useEffect(() => {
    let result = services;
    
    // Filter by category if selected
    if (selectedCategory) {
      result = result.filter(service => service.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        service => 
          service.name.toLowerCase().includes(term) || 
          service.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredServices(result);
  }, [selectedCategory, searchTerm, services]);

  // Format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Format duration
  const formatDuration = (duration: string): string => {
    // Parse ISO 8601 duration format (e.g., PT1H30M)
    const hourMatch = duration.match(/(\d+)H/);
    const minuteMatch = duration.match(/(\d+)M/);
    
    let result = '';
    if (hourMatch) {
      result += `${hourMatch[1]} hr${hourMatch[1] !== '1' ? 's' : ''} `;
    }
    if (minuteMatch) {
      result += `${minuteMatch[1]} min`;
    }
    
    return result.trim();
  };

  // Handle service click
  const handleServiceClick = (service: Service) => {
    onSelect(service);
  };

  // Handle category selection
  const handleCategorySelect = (category: BusinessCategory | null) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
        <button 
          className="ml-2 underline"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
      
      {/* Search and Category Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search services..."
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleCategorySelect(null)}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>
      </div>
      
      {/* Service List */}
      {filteredServices.length === 0 ? (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">
          No services found. Please try a different search or category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">
                    {formatPrice(service.price)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDuration(service.duration)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSelection; 
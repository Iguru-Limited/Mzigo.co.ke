'use client'
import React, { useState, useEffect } from 'react'
import { SearchBar, TrackingPipeline, StatusUpdater } from '@/components/ui/track-mzigo'
import { 
  PipelineStatus, 
  convertLegacyStatus, 
  getCurrentStatusString,   
} from '@/lib/pipelineManager'
import type { Parcel, Order } from '@/types'

// Sample data for demonstration when no localStorage data exists
const sampleOrdersData: Order[] = [
  {
    class: 'SF/USM',
    code: 'SHF150767468',
    orderId: '34569YTZ',
    deliveryDate: '07/07/2022',
    status: 'In-transit',
    details: 'Package is on the way to destination',
    estimatedDelivery: '08/07/2022',
    currentLocation: 'Nairobi Distribution Center',
  },
  {
    class: 'SF/USM',
    code: 'SHF150767468',
    orderId: '92100AWQ',
    deliveryDate: '09/07/2022',
    status: 'Drop off',
    details: 'Package has been dropped off at pickup point',
    estimatedDelivery: '10/07/2022',
    currentLocation: 'Mombasa Pickup Center',
  },
  {
    class: 'SF/USM',
    code: 'SHF150767468',
    orderId: '38047DHW',
    deliveryDate: '22/05/2022',
    status: 'Registered',
    details: 'Package has been registered and is being processed',
    estimatedDelivery: '25/05/2022',
    currentLocation: 'Origin Facility',
  },
  {
    class: 'SF/USM',
    code: 'SHF150767469',
    orderId: '45678XYZ',
    deliveryDate: '15/06/2022',
    status: 'Delivered',
    details: 'Package has been successfully delivered',
    estimatedDelivery: '15/06/2022',
    currentLocation: 'Delivered to recipient',
  },
  {
    class: 'SF/USM',
    code: 'SHF150767470',
    orderId: '78901ABC',
    deliveryDate: '20/08/2022',
    status: 'Notified',
    details: 'Recipient has been notified of delivery completion',
    estimatedDelivery: '20/08/2022',
    currentLocation: 'Delivery completed',
  },
]

const pipelineSteps = [
  'Registered',
  'Drop off',
  'In-transit',
  'Delivered',
  'Notified',
]

const page = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [showStatusUpdater, setShowStatusUpdater] = useState(false)

  // Utility to get cookie by name
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  // Function to simulate parcel status based on time
  const getParcelStatus = (parcel: Parcel): string => {
    const statuses = ['Registered', 'Drop off', 'In-transit', 'Delivered', 'Notified'];
    // Use tracking number hash to determine consistent status
    const hash = parcel.trackingNumber?.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) || 0;
    return statuses[Math.abs(hash) % statuses.length];
  };

  // Function to get current location based on status and route
  const getCurrentLocation = (parcel: Parcel, status: string): string => {
    switch (status) {
      case 'Registered':
        return `${parcel.senderStage} - Processing Center`;
      case 'Drop off':
        return `${parcel.senderStage} - Pickup Point`;
      case 'In-transit':
        return `En route from ${parcel.senderStage} to ${parcel.receiverStage}`;
      case 'Delivered':
        return `${parcel.receiverStage} - Delivered`;
      case 'Notified':
        return `${parcel.receiverStage} - Delivery Completed`;
      default:
        return 'Unknown Location';
    }
  };

  // Function to convert localStorage parcel to Order format
  const convertParcelToOrder = (parcel: Parcel): Order => {
    // Use existing pipeline status or convert legacy status
    let pipelineStatus: PipelineStatus;
    if (parcel.pipelineStatus) {
      pipelineStatus = parcel.pipelineStatus;
    } else {
      // For backward compatibility with old parcels
      const legacyStatus = getParcelStatus(parcel);
      pipelineStatus = convertLegacyStatus(legacyStatus);
    }

    const status = getCurrentStatusString(pipelineStatus);
    const currentDate = new Date();
    const deliveryDate = new Date(currentDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    return {
      class: 'MZ/KE',
      code: `MZ${parcel.trackingNumber?.slice(-6) || '000000'}`,
      orderId: parcel.trackingNumber || '',
      deliveryDate: deliveryDate.toLocaleDateString('en-GB'),
      status: status,
      details: `Package from ${parcel.senderName} to ${parcel.receiverName} - ${parcel.parcelDescription}`,
      estimatedDelivery: new Date(deliveryDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
      currentLocation: getCurrentLocation(parcel, status),
      senderName: parcel.senderName,
      receiverName: parcel.receiverName,
      senderStage: parcel.senderStage,
      receiverStage: parcel.receiverStage,
      parcelDescription: parcel.parcelDescription,
      parcelValue: parcel.parcelValue,
      company: parcel.company,
      pipelineStatus: pipelineStatus,
      createdAt: parcel.createdAt,
    };
  };

  // Load parcels from localStorage on component mount
  useEffect(() => {
    const deviceId = getCookie("device_id") || "unknown_device";
    const storageKey = `registeredParcels_${deviceId}`;
    const storedParcels = localStorage.getItem(storageKey);
    
    if (storedParcels) {
      try {
        const parsedParcels: Parcel[] = JSON.parse(storedParcels);
        const orders = parsedParcels.map(convertParcelToOrder);
        setAllOrders([...orders, ...sampleOrdersData]); // Include sample data for demo
      } catch (error) {
        console.error("Error parsing parcels from localStorage:", error);
        setAllOrders(sampleOrdersData); // Fallback to sample data
      }
    } else {
      setAllOrders(sampleOrdersData); // Use sample data if no localStorage data
    }
  }, []);

  const handleSearch = (query: string) => {
    setIsSearching(true)
    setShowStatusUpdater(false) // Hide status updater when searching
    // Simulate API call delay
    setTimeout(() => {
      const order = allOrders.find((o) => o.orderId.toLowerCase() === query.toLowerCase())
      setSelectedOrder(order || null)
      setIsSearching(false)
    }, 1000)
  }

  // Handle pipeline status updates
  const handleStatusUpdate = (newPipelineStatus: PipelineStatus) => {
    if (!selectedOrder) return;

    // Update the selected order
    const updatedOrder = {
      ...selectedOrder,
      pipelineStatus: newPipelineStatus,
      status: getCurrentStatusString(newPipelineStatus)
    };
    setSelectedOrder(updatedOrder);

    // Update in allOrders array
    const updatedOrders = allOrders.map(order => 
      order.orderId === selectedOrder.orderId ? updatedOrder : order
    );
    setAllOrders(updatedOrders);

    // Update in localStorage if it's a user-created parcel
    const deviceId = getCookie("device_id") || "unknown_device";
    const storageKey = `registeredParcels_${deviceId}`;
    const storedParcels = localStorage.getItem(storageKey);
    
    if (storedParcels) {
      try {
        const parsedParcels: Parcel[] = JSON.parse(storedParcels);
        const updatedParcels = parsedParcels.map(parcel => 
          parcel.trackingNumber === selectedOrder.orderId 
            ? { ...parcel, pipelineStatus: newPipelineStatus }
            : parcel
        );
        localStorage.setItem(storageKey, JSON.stringify(updatedParcels));
      } catch (error) {
        console.error("Error updating parcel in localStorage:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'registered': return 'bg-blue-100 text-blue-800'
      case 'drop off': return 'bg-yellow-100 text-yellow-800'
      case 'in-transit': return 'bg-orange-100 text-orange-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'notified': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        <SearchBar
          placeholder="Enter tracking number (e.g., 34569YTZ)"
          onSearch={handleSearch}
          value={trackingNumber}
          onChange={setTrackingNumber}
        />

        {isSearching && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Searching for your parcel...</span>
          </div>
        )}

        {!isSearching && selectedOrder && (
          <div className="space-y-6">
            {/* Order Details Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Tracking Details
                  </h2>
                  <p className="text-gray-600">Order ID: <span className="font-semibold text-green-600">{selectedOrder.orderId}</span></p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Class</h4>
                  <p className="text-lg font-semibold text-gray-800">{selectedOrder.class}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Code</h4>
                  <p className="text-lg font-semibold text-gray-800">{selectedOrder.code}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Delivery Date</h4>
                  <p className="text-lg font-semibold text-gray-800">{selectedOrder.deliveryDate}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Est. Delivery</h4>
                  <p className="text-lg font-semibold text-gray-800">{selectedOrder.estimatedDelivery}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-2 md:mb-0">
                    <h4 className="text-sm font-medium text-gray-500">Current Location</h4>
                    <p className="text-lg font-semibold text-gray-800">{selectedOrder.currentLocation}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-medium text-gray-500">Status Details</h4>
                    <p className="text-gray-700">{selectedOrder.details}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Pipeline */}
            {selectedOrder.pipelineStatus ? (
              <TrackingPipeline
                pipelineStatus={selectedOrder.pipelineStatus}
                onStatusUpdate={handleStatusUpdate}
              />
            ) : (
              // Fallback for legacy orders without pipeline status
              <TrackingPipeline
                pipelineStatus={convertLegacyStatus(selectedOrder.status)}
                onStatusUpdate={handleStatusUpdate}
              />
            )}

            {/* Status Update Controls */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowStatusUpdater(!showStatusUpdater)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {showStatusUpdater ? 'Hide' : 'Update'} Status
              </button>
              
              {selectedOrder.createdAt && (
                <div className="text-sm text-gray-500">
                  Created: {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              )}
            </div>

            {/* Status Updater Component */}
            {showStatusUpdater && selectedOrder.pipelineStatus && (
              <StatusUpdater
                pipelineStatus={selectedOrder.pipelineStatus}
                onStatusUpdate={handleStatusUpdate}
                isAdmin={true} // Enable admin controls for demo
              />
            )}
          </div>
        )}

        {!isSearching && trackingNumber && !selectedOrder && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Parcel Not Found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find a parcel with tracking number "{trackingNumber}".
            </p>
            <p className="text-sm text-gray-500">
              Please check the tracking number and try again. Make sure you've entered the correct tracking ID.
            </p>
          </div>
        )}

        {!isSearching && !trackingNumber && !selectedOrder && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Your Parcel</h3>
            <p className="text-gray-600 mb-4">
              Enter your tracking number above to see the current status and location of your parcel.
            </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">Try these tracking numbers:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {allOrders.slice(0, 5).map((order) => (
                    <button
                      key={order.orderId}
                      onClick={() => {
                        setTrackingNumber(order.orderId)
                        handleSearch(order.orderId)
                      }}
                      className="px-3 py-1 bg-purple-100 text-green-700 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      {order.orderId}
                    </button>
                  ))}
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default page

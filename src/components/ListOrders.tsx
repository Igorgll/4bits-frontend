import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Select } from "flowbite-react";
import { IoMdRefresh } from "react-icons/io";
import { BsEyeFill } from "react-icons/bs";
import OrderPreviewWindow from "./OrderPreviewWindow";
import { OrderStatus } from "./OrderStatus";

export default function ListOrders() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const response = await fetch("http://localhost:8080/api/v1/orders/all");
    if (response.status === 401) {
      console.error('Unauthorized access - check your credentials');
      return;
    }
    const data = await response.json();
    console.log("Fetched orders:", data);
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenModal = (orderId: number) => {
    console.log("Opening modal for orderId:", orderId);
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setShowModal(false);
    setSelectedOrderId(null);
  };

  const handleChangeStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/orders/updateStatus/${orderId}?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setOrders((prevOrders) => 
          prevOrders.map((order) => 
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const calculateTotalWithFreight = (order: any) => {
    const freightValue = parseFloat(localStorage.getItem('freightValue') || '0');
    const totalItems = order.items.reduce((total: number, item: any) => total + item.product.price * item.quantity, 0);
    return (totalItems + freightValue).toFixed(2);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="overflow-x-auto">
        <Table striped>
          <TableHead>
              <TableHeadCell>Usuário</TableHeadCell>
              <TableHeadCell>Data do Pedido</TableHeadCell>
              <TableHeadCell>Produtos</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Total</TableHeadCell>
              <TableHeadCell>
                <div className="flex items-center justify-center">
                  <IoMdRefresh size={22} color="white" cursor={"pointer"} onClick={fetchOrders} />
                </div>
              </TableHeadCell>
              <TableHeadCell></TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {orders.map((order) => (
              <TableRow key={order.orderId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {order.user.name}
                </TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <p className="line-clamp-2 max-w-96">
                    {order.items.map((item: any) => item.product.productName).join(", ")}
                  </p>
                </TableCell>
                <TableCell className="text-center">
                  {order.status}
                </TableCell>
                <TableCell className="text-center">{calculateTotalWithFreight(order)}</TableCell>
                <TableCell className="text-center">
                  <BsEyeFill color="#cecece" cursor={"pointer"} onClick={() => handleOpenModal(order.orderId)} />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {showModal && selectedOrderId && (
          <OrderPreviewWindow
            showModal={showModal}
            handleClose={handleCloseModal}
            orderId={selectedOrderId}
          />
        )}
      </div>
    </div>
  );
}

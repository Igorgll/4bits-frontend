import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { IoMdRefresh } from "react-icons/io";
import { BsEyeFill } from "react-icons/bs";
import OrderPreviewWindow from "./OrderPreviewWindow";
import { OrderStatus } from "./OrderStatus";
import { useAuth } from "./AuthContext";

export default function ListOrders() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const { userEmail, userRole } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (userEmail && userRole === "ROLE_ESTOQUISTA") {
        const response = await fetch("http://localhost:8080/api/v1/orders/all", {
          headers: {
            'Authorization': `Basic ${btoa(`${userEmail}:${localStorage.getItem('userPassword')}`)}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      }
    };

    fetchOrders();
  }, [userEmail, userRole]);

  const handleOpenModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrderId(null);
  };

  const handleChangeStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/orders/updateStatus/${orderId}?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${userEmail}:${localStorage.getItem('userPassword')}`)}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        setOrders((prevOrders) => 
          prevOrders.map((order) => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div>
        <Table striped>
          <TableHead>
            <TableRow>
              <TableHeadCell>Usuário</TableHeadCell>
              <TableHeadCell>Data do Pedido</TableHeadCell>
              <TableHeadCell>Produtos</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Total</TableHeadCell>
              <TableHeadCell>
                <div className="flex items-center justify-center">
                  <IoMdRefresh size={22} color="white" cursor={"pointer"} />
                </div>
              </TableHeadCell>
              <TableHeadCell></TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {orders.map((order) => (
              <TableRow key={order.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {order.userName}
                </TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <p className="line-clamp-2 max-w-96">{order.products.map((p: any) => p.name).join(", ")}</p>
                </TableCell>
                <TableCell className="text-center">
                  <select
                    value={order.status}
                    onChange={(e) => handleChangeStatus(order.id, e.target.value as OrderStatus)}
                    className="bg-gray-700 text-white"
                  >
                    {Object.values(OrderStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="text-center">{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <BsEyeFill color="#cecece" cursor={"pointer"} onClick={() => handleOpenModal(order.id)} />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedOrderId && (
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
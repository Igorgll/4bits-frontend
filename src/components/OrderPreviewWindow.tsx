import { Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";

interface OrderPreviewWindowProps {
  showModal: boolean;
  handleClose: () => void;
  orderId: number;
}

const OrderPreviewWindow: React.FC<OrderPreviewWindowProps> = ({ showModal, handleClose, orderId }) => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [freightValue, setFreightValue] = useState<number>(0);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const response = await fetch(`http://localhost:8080/api/v1/orders/${orderId}`);
      const data = await response.json();
      setOrderDetails(data);
      setFreightValue(Math.floor(Math.random() * 51)); // Valor de frete aleatório até 50 reais
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (!orderDetails) return null;

  const totalOrderValue = orderDetails.products.reduce((total: number, product: any) => total + product.price * product.quantity, 0) + freightValue;

  return (
    <Modal show={showModal} size={"5xl"} onClose={handleClose}>
      <Modal.Header>Preview do Pedido</Modal.Header>
      <Modal.Body className="p-2">
        <div className="space-y-1">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Produto</Table.HeadCell>
              <Table.HeadCell>Quantidade</Table.HeadCell>
              <Table.HeadCell>Preço Unitário</Table.HeadCell>
              <Table.HeadCell>Preço Total</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {orderDetails.products.map((product: any) => (
                <Table.Row key={product.id}>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>{product.quantity}</Table.Cell>
                  <Table.Cell>{product.price.toFixed(2)}</Table.Cell>
                  <Table.Cell>{(product.price * product.quantity).toFixed(2)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div className="mt-4">
            <p><strong>Valor do Frete:</strong> R$ {freightValue.toFixed(2)}</p>
            <p><strong>Valor Total do Pedido:</strong> R$ {totalOrderValue.toFixed(2)}</p>
            <p><strong>Endereço de Entrega:</strong> {orderDetails.deliveryAddress}</p>
            <p><strong>Forma de Pagamento:</strong> {orderDetails.paymentMethod}</p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderPreviewWindow;
import {
  List,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { OrderStatus } from "./OrderStatus";

interface OrderPreviewWindowProps {
  showModal: boolean;
  handleClose: () => void;
  orderId: number | null;
}

const OrderPreviewWindow: React.FC<OrderPreviewWindowProps> = ({
  showModal,
  handleClose,
  orderId,
}) => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [freightValue, setFreightValue] = useState<number>(0);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      console.log("Fetching details for orderId:", orderId);
      const response = await fetch(
        `http://localhost:8080/api/v1/orders/${orderId}`
      );
      const data = await response.json();
      console.log("Fetched order details:", data);
      setOrderDetails(data);
      setFreightValue(Math.floor(Math.random() * 51));
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (!orderDetails || !orderDetails.items) {
    console.log("No order details found or items is undefined");
    return null;
  }

  console.log("Rendering modal with order details:", orderDetails);

  const totalOrderValue =
    orderDetails.items.reduce(
      (total: number, item: any) => total + item.product.price * item.quantity,
      0
    ) + freightValue;

  return (
    <Modal show={showModal} size={"6xl"} onClose={handleClose}>
      <Modal.Header>Detalhes do Pedido</Modal.Header>
      <Modal.Body className="p-2">
        <div className="space-y-1 p-6 bg-[#111827] rounded">
          <Table striped>
            <TableHead>
                <TableHeadCell>Produto</TableHeadCell>
                <TableHeadCell>Data do Pedido</TableHeadCell>
                <TableHeadCell>Quantidade</TableHeadCell>
                <TableHeadCell className="text-nowrap">Preço Unitário</TableHeadCell>
                <TableHeadCell>Frete</TableHeadCell>
                <TableHeadCell className="text-nowrap">Preço Total</TableHeadCell>
            </TableHead>
            <TableBody>
              {orderDetails.items.map((item: any) => (
                <TableRow key={item.cartId}>
                  <TableCell className="text-nowrap">{item.product.productName}</TableCell>
                  <TableCell className="text-nowrap">{new Date(orderDetails.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-nowrap">R$ {freightValue.toFixed(2)}</TableCell>
                  <TableCell>R$ {(item.product.price * item.quantity + freightValue).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="pt-6 px-2">
            <List unstyled>
              <List.Item className="text-slate-300">
                <List key={orderDetails}>
                    <strong>Endereço de Cobrança</strong>
                    <List.Item><strong>Logradouro:</strong> {orderDetails.user.billingAddress.logradouro}, <strong>Número:</strong> {orderDetails.user.billingAddress.numero}, <strong>Complemento:</strong> {orderDetails.user.billingAddress.complemento}</List.Item>
                    <List.Item><strong>Bairro:</strong> {orderDetails.user.billingAddress.bairro}</List.Item>
                    <List.Item><strong>Localidade:</strong> {orderDetails.user.billingAddress.localidade}</List.Item>
                    <List.Item><strong>CEP:</strong> {orderDetails.user.billingAddress.cep}</List.Item>
                  </List>
              </List.Item>
              <List.Item className="text-slate-300 pt-4">
                <strong>Endereço de Entrega:</strong> {orderDetails.user.userAddress && orderDetails.user.userAddress.length > 0 ? orderDetails.user.userAddress.map((address: any, index: number) => (
                  <List key={index}>
                    <List.Item>{address.logradouro}</List.Item>
                    <List.Item>{address.numero}</List.Item>
                    <List.Item>{address.complemento}</List.Item>
                    <List.Item>{address.bairro}</List.Item>
                    <List.Item>{address.localidade}</List.Item>
                    <List.Item>{address.uf}</List.Item>
                    <List.Item>{address.cep}</List.Item>
                  </List>
                )) : "Não informado"}
              </List.Item>
            </List>

            <div className="py-6 flex items-center gap-4">
              <strong className="text-slate-300">Status:</strong>
              <Select
                value={orderDetails.status}
                className="bg-gray-700 text-white rounded"
              >
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderPreviewWindow;

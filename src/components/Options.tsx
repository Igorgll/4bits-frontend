import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Options = () => {
  const { userRole } = useAuth();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-md">
        <h1 className="text-white text-xl font-bold mb-4">Menu</h1>
        <ul className="space-y-2">
          {userRole === 'ROLE_ADMIN' && (
            <>
              <li>
                <Link
                  to="/listUsers"
                  className="text-white hover:bg-gray-700 px-4 py-2 rounded-md block"
                >
                  Listar Usuários
                </Link>
              </li>
              <li>
                <Link
                  to="/listProducts"
                  className="text-white hover:bg-gray-700 px-4 py-2 rounded-md block"
                >
                  Listar Produtos
                </Link>
              </li>
            </>
          )}
          {userRole === 'ROLE_ESTOQUISTA' && (
            <li>
              <Link
                to="/list/orders"
                className="text-white hover:bg-gray-700 px-4 py-2 rounded-md block"
              >
                Listar Pedidos
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Options;

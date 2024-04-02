import { List } from "flowbite-react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="bg-[#111827]">
        <Navbar />
          <div className="p-20">
            <List horizontal className="p-30 gap-4">
              <List.Item><Card /></List.Item>
              <List.Item><Card /></List.Item>
              <List.Item><Card /></List.Item>
              <List.Item><Card /></List.Item>
              <List.Item><Card /></List.Item>
              <List.Item><Card /></List.Item>
            </List>
          </div>
        <Footer />
    </div>
  );
}
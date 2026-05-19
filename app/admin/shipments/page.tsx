"use client";

import { Search, Filter, MoreHorizontal, MapPin, Package, Download, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";

const mockShipments = [
  { id: "AWB-78901234", tenant: "Acme Corp", route: "BOM → DEL", courier: "Delhivery", status: "In Transit" },
  { id: "AWB-45678901", tenant: "TechNova", route: "BLR → HYD", courier: "Bluedart", status: "Delivered" },
  { id: "AWB-12345678", tenant: "StoreFront", route: "CCU → PNQ", courier: "XpressBees", status: "Pending" },
  { id: "AWB-98765432", tenant: "Acme Corp", route: "DEL → MAA", courier: "Delhivery", status: "RTO" },
  { id: "AWB-34567890", tenant: "GlobalTech", route: "BOM → AMD", courier: "Ecom Express", status: "Out for Delivery" },
];

export default function GlobalShipmentsPage() {
  const [filter, setFilter] = useState("All");

  const handleAction = (action: string, awb: string) => {
    toast.success(`${action} initiated for ${awb}`);
  };

  return (
    <div className="space-y-6 w-full mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Global Shipments</h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
          Monitor and search across all cross-tenant shipment activities.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#2a2e3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            {["All", "In Transit", "Delivered", "Exceptions"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search AWB or Tenant..."
                className="pl-9 w-full sm:w-[300px]"
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => toast.info("Advanced filters coming soon.")}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>AWB Number</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Courier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    {shipment.id}
                  </div>
                </TableCell>
                <TableCell>{shipment.tenant}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {shipment.route}
                  </div>
                </TableCell>
                <TableCell>{shipment.courier}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      shipment.status === "Delivered" ? "default" : 
                      shipment.status === "RTO" ? "destructive" : 
                      shipment.status === "Pending" ? "outline" : "secondary"
                    }
                  >
                    {shipment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleAction("View Details", shipment.id)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("Download Label", shipment.id)}>
                        <Download className="mr-2 h-4 w-4" /> Download Label
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleAction("Mark as Exception", shipment.id)}>
                        Flag Exception
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

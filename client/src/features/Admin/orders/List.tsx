
import { useEffect, useState } from "react"
import LoadingComponent from "../../../app/layout/LoadingComponent"
import { useAppDispatch, useAppSelector } from "../../../store/configureStore"
import { allOrderSelectors, fetchAllOrdersAsync } from "../../orders/OrderSlice"
import { Box, Typography, Paper, Chip, Breadcrumbs, Link, Container, Divider } from "@mui/material"
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material"
import type { Order } from "../../../app/models/order"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import agent from "../../../app/api/agent"

export default function Orders() {
  const statusCategories = [
    { id: "1", name: "Order Confirming", statuses: ["new"], color: "#ff9800" },
    { id: "2", name: "OnPreparing", statuses: ["OnPreparing"], color: "#f44336" },
    { id: "3", name: "Shipping", statuses: ["Shipping"], color: "#2196f3" },
    { id: "4", name: "Delivered", statuses: ["Delivered"], color: "#4caf50" },
  ]

  const [ordersByStatus, setOrdersByStatus] = useState<{ [key: string]: Order[] }>({})
  const [activeId, setActiveId] = useState<string | null>(null)
  const { allOrdersLoaded } = useAppSelector((state) => state.order)
  const orders = useAppSelector((state) => allOrderSelectors.selectAll(state))
  const dispatch = useAppDispatch()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  )

  useEffect(() => {
    if (!allOrdersLoaded) dispatch(fetchAllOrdersAsync())
  }, [dispatch, allOrdersLoaded])

  useEffect(() => {
    if (allOrdersLoaded) {
      const groupedOrders = statusCategories.reduce(
        (acc, category) => {
          acc[category.name] = orders.filter((order) => category.statuses.includes(order.orderStatus))
          return acc
        },
        {} as { [key: string]: Order[] },
      )

      setOrdersByStatus(groupedOrders)
    }
  }, [allOrdersLoaded, orders])


  async function handleDragEnd(event: any) {
    setActiveId(null)
    const { active, over } = event

    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type === "ORDER" && overData?.type === "CONTAINER") {
      const orderId = Number(active.id)
      const sourceContainerId = activeData.containerId
      const destinationContainerId = over.id.toString()

      if (sourceContainerId === destinationContainerId) return

      const sourceCategory = statusCategories.find((c) => c.id === sourceContainerId)
      const destCategory = statusCategories.find((c) => c.id === destinationContainerId)

      if (!sourceCategory || !destCategory) return

      const orderToMove = ordersByStatus[sourceCategory.name].find((o) => o.id === orderId)
      if (!orderToMove) return

      const newStatus = destCategory.statuses[0]

      // Update UI optimistically
      setOrdersByStatus((prev) => {
        const newOrders = { ...prev }
        newOrders[sourceCategory.name] = newOrders[sourceCategory.name].filter((o) => o.id !== orderId)

        if (!newOrders[destCategory.name]) {
          newOrders[destCategory.name] = []
        }

        const updatedOrder = { ...orderToMove, orderStatus: newStatus }
        newOrders[destCategory.name] = [...newOrders[destCategory.name], updatedOrder]

        return newOrders
      })

      try {
        await agent.Orders.update(orderId, newStatus)
      } catch (error) {
        setOrdersByStatus((prev) => {
          const newOrders = { ...prev }
          newOrders[destCategory.name] = newOrders[destCategory.name].filter((o) => o.id !== orderId)

          const originalOrder = orders.find((o) => o.id === orderId)
          if (originalOrder) {
            newOrders[sourceCategory.name] = [...newOrders[sourceCategory.name], originalOrder]
          }

          return newOrders
        })
      }
    }
  }

  if (!allOrdersLoaded) return <LoadingComponent message="Loading Orders..." />

  const activeOrder = activeId ? orders.find((order) => order.id.toString() === activeId) : null

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section with Breadcrumbs */}
      <Box
        sx={{
          bgcolor: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          mb: 3,
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link underline="hover" sx={{ display: "flex", alignItems: "center" }} color="inherit" href="/">
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </Link>
            <Typography color="text.primary" sx={{ display: "flex", alignItems: "center" }}>
              Orders
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 3,
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(e) => setActiveId(e.active.id as string)}
            onDragEnd={handleDragEnd}
          >
            {statusCategories.map((category) => (
              <StatusColumn key={category.id} category={category} orders={ordersByStatus[category.name] || []} />
            ))}

            <DragOverlay>{activeId && activeOrder ? <OrderCard order={activeOrder} isOverlay /> : null}</DragOverlay>
          </DndContext>
        </Box>
      </Container>
    </Box>
  )
}

function StatusColumn({ category, orders }) {
  const { setNodeRef } = useDroppable({
    id: category.id,
    data: {
      type: "CONTAINER",
      containerId: category.id,
    },
  })

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderTop: `4px solid ${category.color}`,
        bgcolor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {category.name}
        </Typography>
        <Chip label={orders.length} size="small" sx={{ bgcolor: category.color, color: "white" }} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box
        ref={setNodeRef}
        sx={{
          flexGrow: 1,
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {orders.length > 0 ? (
          orders.map((order) => <DraggableOrder key={order.id} order={order} containerId={category.id} />)
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              p: 2,
              textAlign: "center",
              fontStyle: "italic",
              mt: 2,
            }}
          >
            No orders
          </Typography>
        )}
      </Box>
    </Paper>
  )
}

function DraggableOrder({ order, containerId }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: order.id.toString(),
    data: {
      type: "ORDER",
      containerId,
      orderId: order.id,
    },
  })

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform) }} {...attributes} {...listeners}>
      <OrderCard order={order} />
    </div>
  )
}

function OrderCard({ order, isOverlay = false }) {
  return (
    <Paper
      elevation={isOverlay ? 4 : 1}
      sx={{
        p: 2,
        borderRadius: 1,
        cursor: "grab",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 3,
          transform: isOverlay ? "none" : "translateY(-2px)",
        },
        bgcolor: isOverlay ? "white" : "inherit",
        border: "1px solid #eee",
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        Order #{order.id}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Customer:
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {order.buyerId || "N/A"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Total:
        </Typography>
        <Typography variant="body2" fontWeight={600} color="primary">
          ${order.total.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  )
}

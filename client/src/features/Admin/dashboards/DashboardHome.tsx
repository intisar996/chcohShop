
import { useEffect } from "react"
import {useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Avatar from "@mui/material/Avatar"
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AttachMoney as AttachMoneyIcon,
  Person as PersonIcon,
  ShoppingBag as ShoppingBagIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../store/configureStore"
import { allOrderSelectors, fetchAllOrdersAsync } from "../../orders/OrderSlice"
import RecentOrdersTable from "./RecentOrdersTable"
import TopProductsCard from "./TopProductsCard"


export default function DashboardHome() {
  const theme = useTheme()
  const { allOrdersLoaded } = useAppSelector((state) => state.order)
  const orders = useAppSelector((state) => allOrderSelectors.selectAll(state))
  const dispatch = useAppDispatch()

  // Fetch orders when component mounts
  useEffect(() => {
    if (!allOrdersLoaded) {
      dispatch(fetchAllOrdersAsync())
    }
  }, [dispatch, allOrdersLoaded])

  // Calculate dashboard metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const uniqueCustomers = new Set(orders.map((order) => order.buyerId)).size

  return (
    <>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Revenue
                </Typography>
                <Avatar sx={{ bgcolor: "rgba(33, 150, 243, 0.1)", width: 40, height: 40 }}>
                  <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                ${totalRevenue.toFixed(2)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowUpwardIcon sx={{ color: theme.palette.success.main, fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                  +12.5%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Orders
                </Typography>
                <Avatar sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", width: 40, height: 40 }}>
                  <ShoppingBagIcon sx={{ color: theme.palette.error.main }} />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                {totalOrders}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowUpwardIcon sx={{ color: theme.palette.success.main, fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                  +8.2%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Customers
                </Typography>
                <Avatar sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", width: 40, height: 40 }}>
                  <PersonIcon sx={{ color: theme.palette.success.main }} />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                {uniqueCustomers}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowUpwardIcon sx={{ color: theme.palette.success.main, fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                  +5.3%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Page Views
                </Typography>
                <Avatar sx={{ bgcolor: "rgba(255, 152, 0, 0.1)", width: 40, height: 40 }}>
                  <VisibilityIcon sx={{ color: theme.palette.warning.main }} />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                48.6K
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowDownwardIcon sx={{ color: theme.palette.error.main, fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                  -2.7%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders and Top Products */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <RecentOrdersTable />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopProductsCard />
        </Grid>
      </Grid>
    </>
  )
}

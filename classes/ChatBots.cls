global class ChatBots {
    public class OrderOutput{
        @InvocableVariable(required=true)
        public String sStatus;
}
    public class OrderInput{
        @InvocableVariable(required=true)
        public String sOrderNumber;
}
    @InvocableMethod(label='Get Order Status')
    public static List<OrderOutput> getOrderStatus(List<OrderInput> orderInputs)
    {
        Set<String> orderNumbers = new Set<String>();
        for (OrderInput orderInput : orderInputs)
            orderNumbers.add(orderInput.sOrderNumber);
        Map<String, String> mapNameStatus = new Map<String, String>();
        List<Order> orders = [SELECT Name, Status FROM Order where OrderNumber = '00000234']; 
        if (orders.size()>0)
        {
            for (Order order : orders)
                mapNameStatus.put(order.Name, order.Status); 
		}
        List<OrderOutput> orderOutputs = new List<OrderOutput>();
        for (OrderInput orderInput : orderInputs)
        {
            OrderOutput orderOutput = new OrderOutput();
            orderOutput.sStatus = mapNameStatus.get(orderInput.sOrderNumber);
            orderOutputs.add(orderOutput);
		}
        return orderOutputs;
      }
}
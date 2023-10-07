const CustomerOrderRequest = () => {
  return <div>Customer Request</div>
}

CustomerOrderRequest.acl = {
  subject: 'customer-order-request',
  ability: 'read'
}

export default CustomerOrderRequest

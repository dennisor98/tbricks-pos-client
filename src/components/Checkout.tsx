import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Button, TextField, Box, Typography, Divider } from '@mui/material';
import { DollarSign, Smartphone, Printer, X } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  tax: number;
  grandTotal: number;
  onComplete: (paymentMethod: 'cash' | 'mpesa', customerInfo?: any) => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  open,
  onClose,
  cart,
  total,
  tax,
  grandTotal,
  onComplete
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaTransactionId, setMpesaTransactionId] = useState('');
  const [completedSale, setCompletedSale] = useState<any>(null);
  const [step, setStep] = useState<'payment' | 'processing' | 'complete' | 'receipt' | 'receipt-view'>('payment');

  const handlePaymentMethodChange = (method: 'cash' | 'mpesa') => {
    setPaymentMethod(method);
  };

  const calculateChange = () => {
    const received = parseFloat(cashReceived) || 0;
    return Math.max(0, received - grandTotal);
  };

  const handleCheckout = () => {
    setStep('processing');
    
    // Simulate processing time
    setTimeout(() => {
      setStep('complete');
      setTimeout(() => {
        // Create sale record
        const sale = {
          id: Date.now().toString(),
          customerName: 'Guest',
          customerEmail: '',
          customerPhone: '',
          items: cart.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            subtotal: item.subtotal
          })),
          subtotal: total,
          tax,
          total: grandTotal,
          paymentMethod,
          timestamp: new Date().toISOString(),
          status: 'completed'
        };
        setCompletedSale(sale);
        setStep('receipt');
      }, 2000);
    }, 2000);
  };

  const handleFinalize = () => {
    if (completedSale) {
      onComplete(paymentMethod, undefined);
    }
    // Reset form
    setStep('payment');
    setPaymentMethod('cash');
    setCashReceived('');
    setMpesaPhone('');
    setMpesaTransactionId('');
    setCompletedSale(null);
    onClose();
  };

  const canProceed = () => {
    if (paymentMethod === 'cash') {
      const received = parseFloat(cashReceived) || 0;
      return received >= grandTotal;
    }
    if (paymentMethod === 'mpesa') {
      return mpesaPhone.length >= 10 && mpesaTransactionId.length >= 1;
    }
    return false;
  };

  // Receipt View Dialog
  if (step === 'receipt-view' && completedSale) {
    return (
      <Dialog open={open} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Receipt</Typography>
          <IconButton onClick={() => {}} size="small">
            ×
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box id="receipt-content" sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 3,
            bgcolor: 'white'
          }}>
            {/* Receipt Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>POS SYSTEM</Typography>
              <Typography variant="body2" color="textSecondary">Receipt #{completedSale.id.slice(-8)}</Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(completedSale.timestamp).toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Items */}
            <Box sx={{ mb: 2 }}>
              {completedSale.items.map((item: any, index: number) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">{item.productName}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    ${item.subtotal.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Totals */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">${completedSale.subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Tax (8%)</Typography>
                <Typography variant="body2">${completedSale.tax.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">${completedSale.total.toFixed(2)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Payment Method */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Payment Method</Typography>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {completedSale.paymentMethod}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Thank you for your purchase!
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => {
                const printContent = document.getElementById('receipt-content');
                if (printContent) {
                  const printWindow = window.open('', '', 'width=400,height=600');
                  if (printWindow) {
                    printWindow.document.write('<html><head><title>Receipt</title>');
                    printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;} .receipt-item{display:flex;justify-content:space-between;margin:10px 0;}</style>');
                    printWindow.document.write('</head><body>');
                    printWindow.document.write(printContent.innerHTML);
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.print();
                  }
                }
              }}
              fullWidth
            >
              <Printer style={{ width: 20, height: 20, marginRight: 8 }} />
              Print Receipt
            </Button>
            <Button
              variant="outlined"
              onClick={handleFinalize}
              fullWidth
            >
              Done
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'processing') {
    return (
      <Dialog open={open} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 8, textAlign: 'center' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: 2
          }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Processing Payment...</Typography>
          <Typography variant="body2" color="textSecondary">
            Please wait while we process your transaction
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'complete') {
    return (
      <Dialog open={open} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 8, textAlign: 'center' }}>
          <Box sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: 'success.light', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
            mb: 2
          }}>
            <DollarSign style={{ color: '#2e7d32', fontSize: 32 }} />
          </Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Payment Successful!</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Transaction completed successfully
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>${grandTotal.toFixed(2)}</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Checkout</Typography>
        <IconButton onClick={onClose} size="small">
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {/* Order Summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>
          <Box sx={{ mb: 2 }}>
            {cart.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 32, height: 32, bgcolor: 'grey.200', borderRadius: 1 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{item.product.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {item.quantity} × ${item.product.price}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  ${item.subtotal.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2">${total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Tax (8%)</Typography>
              <Typography variant="body2">${tax.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary">${grandTotal.toFixed(2)}</Typography>
            </Box>
          </Box>
        </Box>


        {/* Payment Method Selection */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Payment Method</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Button
              variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
              onClick={() => handlePaymentMethodChange('cash')}
              sx={{ display: 'flex', flexDirection: 'column', py: 2 }}
            >
              <DollarSign style={{ width: 24, height: 24, marginBottom: 8 }} />
              <span>Cash</span>
            </Button>
            <Button
              variant={paymentMethod === 'mpesa' ? 'contained' : 'outlined'}
              onClick={() => handlePaymentMethodChange('mpesa')}
              sx={{ display: 'flex', flexDirection: 'column', py: 2 }}
            >
              <Smartphone style={{ width: 24, height: 24, marginBottom: 8 }} />
              <span>MPESA</span>
            </Button>
          </Box>
        </Box>

        {/* Payment Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Payment Details</Typography>
          
          {paymentMethod === 'mpesa' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="MPESA Phone Number"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value.replace(/[^0-9+]/g, '').slice(0, 13))}
                placeholder="e.g. 0712345678"
                size="small"
              />
              <TextField
                fullWidth
                label="Transaction ID / M-PESA Receipt"
                value={mpesaTransactionId}
                onChange={(e) => setMpesaTransactionId(e.target.value)}
                placeholder="e.g. SHK4F7G2RV"
                size="small"
              />
              <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" color="info.main">
                  Send KES {grandTotal.toFixed(2)} to the till number, then enter the transaction ID above.
                </Typography>
              </Box>
            </Box>
          )}

          {paymentMethod === 'cash' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Cash Received"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                type="number"
                placeholder="0.00"
                size="small"
              />
              {parseFloat(cashReceived) >= grandTotal && (
                <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="success.main">
                    Change to return: ${calculateChange().toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

        </Box>

        {/* Receipt Selection */}
        {step === 'receipt' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Would you like a receipt?</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setStep('receipt-view');
                }}
                sx={{ py: 2 }}
              >
                <Printer style={{ width: 20, height: 20, marginRight: 8 }} />
                View Receipt
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  handleFinalize();
                }}
                sx={{ py: 2 }}
              >
                <X style={{ width: 20, height: 20, marginRight: 8 }} />
                No Receipt
              </Button>
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={onClose} variant="outlined" fullWidth>
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            variant="contained"
            fullWidth
            disabled={!canProceed()}
          >
            Complete Payment ${grandTotal.toFixed(2)}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Trash2, 
  UserCheck, 
  Info, 
  CheckCircle, 
  Check, 
  CreditCard,
  Shirt, 
  Tag, 
  Calendar, 
  Package, 
  Smartphone, 
  Sliders, 
  Minus, 
  Plus, 
  Eye, 
  RefreshCw,
  Award,
  Edit,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Player, KitType, JerseySize, BadgeType, JerseyCustomization, CartItem, JerseyOrder, OrderStatus } from '../types';

interface JerseyStoreProps {
  players: Player[];
  orders?: JerseyOrder[];
  onUpdateOrders?: (newOrders: JerseyOrder[]) => void;
  triggerToast: (msg: string) => void;
}

export default function JerseyStore({ 
  players = [], 
  orders = [], 
  onUpdateOrders, 
  triggerToast 
}: JerseyStoreProps) {
  // Store customization state
  const [kitType, setKitType] = useState<KitType>('Home');
  const [size, setSize] = useState<JerseySize>('M');
  const [badgeType, setBadgeType] = useState<BadgeType>('Champions Gold');
  const [hasLeaguePatch, setHasLeaguePatch] = useState<boolean>(true);
  const [customName, setCustomName] = useState<string>('');
  const [customNumber, setCustomNumber] = useState<string>('');
  
  // Viewer angle
  const [isFrontView, setIsFrontView] = useState<boolean>(false);
  
  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [measurementUnit, setMeasurementUnit] = useState<'cm' | 'inches'>('cm');
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Invoice
  
  // Checkout shipping fields
  const [shippingName, setShippingName] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [shippingEmail, setShippingEmail] = useState<string>('');
  const [shippingPhone, setShippingPhone] = useState<string>('');

  // Admin View & Order Edit states
  const [activeViewMode, setActiveViewMode] = useState<'store' | 'orders'>('store');
  const [activeAdminTab, setActiveAdminTab] = useState<'list' | 'analytics' | 'builder'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingOrder, setEditingOrder] = useState<JerseyOrder | null>(null);

  // States for Direct Custom Order Builder form
  const [builderName, setBuilderName] = useState<string>('Arena Manager - ground 4');
  const [builderAddress, setBuilderAddress] = useState<string>('Apex training field, London, UK');
  const [builderEmail, setBuilderEmail] = useState<string>('store@apexunitedfc.com');
  const [builderPhone, setBuilderPhone] = useState<string>('+44 7711 223344');
  const [builderKitType, setBuilderKitType] = useState<KitType>('Home');
  const [builderSize, setBuilderSize] = useState<JerseySize>('M');
  const [builderBadgeType, setBuilderBadgeType] = useState<BadgeType>('Champions Gold');
  const [builderHasLeaguePatch, setBuilderHasLeaguePatch] = useState<boolean>(true);
  const [builderCustomName, setBuilderCustomName] = useState<string>('MANAGER');
  const [builderCustomNumber, setBuilderCustomNumber] = useState<string>('12');
  const [builderQuantity, setBuilderQuantity] = useState<number>(1);
  const [builderPrice, setBuilderPrice] = useState<number>(85);
  const [isBuilderFrontView, setIsBuilderFrontView] = useState<boolean>(false);

  // States of currently edited order fields
  const [editShippingName, setEditShippingName] = useState<string>('');
  const [editShippingAddress, setEditShippingAddress] = useState<string>('');
  const [editShippingEmail, setEditShippingEmail] = useState<string>('');
  const [editShippingPhone, setEditShippingPhone] = useState<string>('');
  const [editOrderStatus, setEditOrderStatus] = useState<OrderStatus>('Pending');
  const [editPrintName, setEditPrintName] = useState<string>('');
  const [editPrintNumber, setEditPrintNumber] = useState<string>('');
  
  // Custom generated Invoice Receipt
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [estDeliveryDate, setEstDeliveryDate] = useState<string>('');
  
  // Load Cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('apex_jersey_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch {
      // Ignore reading error
    }
  }, []);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('apex_jersey_cart', JSON.stringify(updatedCart));
  };

  // Base configurations for kits
  const KIT_CONFIGS = {
    Home: {
      name: 'Premier Home Kit',
      baseColor: '#047857', // Emerald 700
      accentColor: '#f59e0b', // Gold / Amber 500
      collarColor: '#065f46', // Emerald 800
      secondaryColor: '#fef08a', // Pale Yellow
      sponsorColor: '#ffffff',
      textColor: '#ffffff',
      stripeColor: '#fbbf24',
      price: 85,
      description: 'The iconic emerald green with sovereign gold lines, paying homage to the founding years of Apex United.'
    },
    Away: {
      name: 'Midnight Obsidian Away Kit',
      baseColor: '#0f172a', // Slate 900
      accentColor: '#10b981', // Mint 500
      collarColor: '#1e293b', // Slate 800
      secondaryColor: '#34d399', // Mint light
      sponsorColor: '#10b981',
      textColor: '#10b981',
      stripeColor: '#334155',
      price: 85,
      description: 'Stealth black base highlighting toxic neon mint collar trims for elite performances under night city stadium lights.'
    },
    Third: {
      name: 'Sovereign Ivory Third Kit',
      baseColor: '#f1f5f9', // Slate 100 / Off-white
      accentColor: '#881337', // Rose 900 / Burgundy
      collarColor: '#e2e8f0', // Slate 200
      secondaryColor: '#ea580c', // Orange accent
      sponsorColor: '#881337',
      textColor: '#881337',
      stripeColor: '#9f1239',
      price: 85,
      description: 'Pristine sovereign ivory white lined in royal burgundy stripes, blending stadium intensity with casual design elegance.'
    },
    Goalkeeper: {
      name: 'Cyber Pink Goalkeeper Kit',
      baseColor: '#db2777', // Pink 600
      accentColor: '#000000', // Acid/Cyber accent
      collarColor: '#be185d', // Pink 700
      secondaryColor: '#f43f5e', // Rose 500
      sponsorColor: '#ffffff',
      textColor: '#ffffff',
      stripeColor: '#9d174d',
      price: 90,
      description: 'Bold pink design loaded with high voltage geometric gradients to assert absolute goal-line dominance.'
    }
  };

  const currentConfig = KIT_CONFIGS[kitType];

  // Calculate pricing
  const calculateSinglePrice = (kit: KitType, badge: BadgeType, patch: boolean, hasCustomizer: boolean) => {
    let cost = KIT_CONFIGS[kit].price;
    if (badge === 'Champions Gold') cost += 15;
    if (badge === 'Standard Crest') cost += 5;
    if (patch) cost += 5;
    if (hasCustomizer) cost += 10;
    return cost;
  };

  const hasNameNumberSet = customName.trim() !== '' || customNumber.trim() !== '';
  const currentSingleItemPrice = calculateSinglePrice(kitType, badgeType, hasLeaguePatch, hasNameNumberSet);

  // Quick player injector
  const injectPlayerPreset = (p: Player) => {
    setCustomName(p.name.split(' ').pop() || p.name); // Prefer last name
    setCustomNumber(String(p.number));
    triggerToast(`Applied squad roster details: ${p.number} - ${p.name}`);
  };

  // Cart operations
  const addToCart = () => {
    const finalName = customName.trim().toUpperCase() || 'APEX';
    const finalNumber = customNumber.trim() || '26';

    const cust: JerseyCustomization = {
      kitType,
      size,
      badgeType,
      customName: finalName,
      customNumber: finalNumber,
      hasLeaguePatch
    };

    const cartId = `${kitType}-${size}-${badgeType}-${hasLeaguePatch}-${finalName}-${finalNumber}`;
    const existingIndex = cart.findIndex(item => item.id === cartId);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCartToStorage(updated);
    } else {
      const newItem: CartItem = {
        id: cartId,
        customization: cust,
        quantity: 1,
        price: currentSingleItemPrice
      };
      saveCartToStorage([...cart, newItem]);
    }
    triggerToast(`Added ${KIT_CONFIGS[kitType].name} to your Shopping Bag.`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return { ...item, quantity: nextQty < 1 ? 1 : nextQty };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  const removeCartItem = (id: string) => {
    const item = cart.find(i => i.id === id);
    const updated = cart.filter(item => item.id !== id);
    saveCartToStorage(updated);
    if (item) {
      triggerToast(`Removed ${KIT_CONFIGS[item.customization.kitType].name} from Shopping Bag.`);
    }
  };

  const clearCart = () => {
    saveCartToStorage([]);
    triggerToast('Shopping bag cleared.');
  };

  // Pricing calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartShippingCost = cartSubtotal > 150 || cartSubtotal === 0 ? 0 : 15;
  const cartTotal = cartSubtotal + cartShippingCost;

  // Checkout flows
  const initiateCheckout = () => {
    if (cart.length === 0) {
      triggerToast('Your shopping bag is empty.');
      return;
    }
    // Set typical user details as defaults
    setShippingName('Aston Sterling');
    setShippingAddress('44 Apex Row, Arena Heights, London, UK');
    setShippingEmail('fan@apexunitedfc.com');
    setPhoneValueIfEmpty();
    setIsCheckoutOpen(true);
    setCheckoutStep(1);
  };

  const setPhoneValueIfEmpty = () => {
    setShippingPhone('+44 7911 123456');
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName || !shippingAddress || !shippingEmail) {
      triggerToast('Missing shipping variables.');
      return;
    }
    setCheckoutStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate invoice and order success
    setInvoiceId('APX-' + Math.floor(Math.random() * 89999 + 10000));
    
    // Estimate delivery: 5 days from today
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 5);
    setEstDeliveryDate(delivery.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    
    setCheckoutStep(3);
    triggerToast('Secure transaction completed! Preparing custom jersey print.');
  };

  const finalizeAllOrders = () => {
    if (cart.length > 0) {
      const newOrder: JerseyOrder = {
        id: invoiceId || ('APX-' + Math.floor(Math.random() * 89999 + 10000)),
        shippingName,
        shippingAddress,
        shippingEmail,
        shippingPhone,
        items: [...cart],
        subtotal: cartSubtotal,
        shippingCost: cartShippingCost,
        total: cartTotal,
        status: 'Pending',
        date: new Date().toISOString(),
        estDeliveryDate: estDeliveryDate || '5-7 business days'
      };
      
      const updatedOrders = [newOrder, ...orders];
      if (onUpdateOrders) {
        onUpdateOrders(updatedOrders);
      }
      triggerToast(`Order ${newOrder.id} successfully recorded in the admin catalog!`);
    }

    // Clear cart and reset
    setIsCheckoutOpen(false);
    saveCartToStorage([]);
  };

  // Admin Order Panel Operations
  const handleStartEditOrder = (order: JerseyOrder) => {
    setEditingOrder(order);
    setEditShippingName(order.shippingName);
    setEditShippingAddress(order.shippingAddress);
    setEditShippingEmail(order.shippingEmail);
    setEditShippingPhone(order.shippingPhone || '');
    setEditOrderStatus(order.status);
    
    // Default to the custom name and number of the first item, if exists
    if (order.items && order.items.length > 0) {
      setEditPrintName(order.items[0].customization.customName || '');
      setEditPrintNumber(order.items[0].customization.customNumber || '');
    } else {
      setEditPrintName('');
      setEditPrintNumber('');
    }
  };

  const handleSaveEditedOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    
    const updatedOrders = orders.map(o => {
      if (o.id === editingOrder.id) {
        // Create copies of the items with updated names / numbers if they had custom labels
        const updatedItems = o.items.map((item, idx) => {
          if (idx === 0) { // update first item
            return {
              ...item,
              customization: {
                ...item.customization,
                customName: editPrintName.trim().toUpperCase(),
                customNumber: editPrintNumber.trim()
              }
            };
          }
          return item;
        });

        return {
          ...o,
          shippingName: editShippingName.trim(),
          shippingAddress: editShippingAddress.trim(),
          shippingEmail: editShippingEmail.trim(),
          shippingPhone: editShippingPhone.trim(),
          status: editOrderStatus,
          items: updatedItems
        };
      }
      return o;
    });
    
    if (onUpdateOrders) {
      onUpdateOrders(updatedOrders);
    }
    setEditingOrder(null);
    triggerToast(`Order ${editingOrder.id} variables successfully updated!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Are you sure you want to cancel and delete order ${orderId}?`)) {
      const updatedOrders = orders.filter(o => o.id !== orderId);
      if (onUpdateOrders) {
        onUpdateOrders(updatedOrders);
      }
      triggerToast(`Order ${orderId} has been liquidated.`);
    }
  };

  const handleCreateMockOrder = () => {
    const randomInvoice = 'APX-' + Math.floor(Math.random() * 89999 + 10000);
    const mockOrder: JerseyOrder = {
      id: randomInvoice,
      shippingName: 'Club Training Academy Ground 3',
      shippingAddress: 'Apex Performance Complex, Pit 2 Equipment Room, London, UK',
      shippingEmail: 'kitman@apexunitedfc.com',
      shippingPhone: '+44 7911 999123',
      items: [
        {
          id: `Home-L-Champions Gold-false-TRAINING-00`,
          customization: {
            kitType: 'Home',
            size: 'L',
            badgeType: 'Champions Gold',
            customName: 'APEX SQUAD',
            customNumber: '11',
            hasLeaguePatch: true
          },
          quantity: 2,
          price: 115
        }
      ],
      subtotal: 230,
      shippingCost: 0,
      total: 230,
      status: 'Pending',
      date: new Date().toISOString(),
      estDeliveryDate: 'Immediate Courier Delivery'
    };
    
    const updatedOrders = [mockOrder, ...orders];
    if (onUpdateOrders) {
      onUpdateOrders(updatedOrders);
    }
    triggerToast(`Direct club contract order ${randomInvoice} drafted and registered!`);
  };

  const handleCreateBuilderOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const randomInvoice = 'APX-' + Math.floor(Math.random() * 89999 + 10000);
    const sub = builderPrice * builderQuantity;
    const finalOrder: JerseyOrder = {
      id: randomInvoice,
      shippingName: builderName.trim(),
      shippingAddress: builderAddress.trim(),
      shippingEmail: builderEmail.trim(),
      shippingPhone: builderPhone.trim(),
      items: [
        {
          id: `${builderKitType}-${builderSize}-${builderBadgeType}-${builderHasLeaguePatch}-${builderCustomName.toUpperCase()}-${builderCustomNumber}`,
          customization: {
            kitType: builderKitType,
            size: builderSize,
            badgeType: builderBadgeType,
            customName: builderCustomName.trim().toUpperCase() || 'PLAYER',
            customNumber: builderCustomNumber.trim() || '10',
            hasLeaguePatch: builderHasLeaguePatch
          },
          quantity: builderQuantity,
          price: builderPrice
        }
      ],
      subtotal: sub,
      shippingCost: 0,
      total: sub,
      status: 'Pending',
      date: new Date().toISOString(),
      estDeliveryDate: '3-10 Business Days'
    };

    const updatedOrders = [finalOrder, ...orders];
    if (onUpdateOrders) {
      onUpdateOrders(updatedOrders);
    }
    triggerToast(`Manual direct order ${randomInvoice} successfully drafted and registered!`);
    setActiveAdminTab('list');
  };

  // Live SVG Kit Drawers
  const renderJerseyVector = (
    overrideConfig?: {
      kitType: KitType;
      customName: string;
      customNumber: string;
      badgeType: BadgeType;
      hasLeaguePatch: boolean;
      isFrontView: boolean;
    }
  ) => {
    const activeKitType = overrideConfig ? overrideConfig.kitType : kitType;
    const activeCustomName = (overrideConfig ? overrideConfig.customName : customName).trim().toUpperCase() || (overrideConfig ? 'SQUAD' : 'APEX');
    const activeCustomNumber = (overrideConfig ? overrideConfig.customNumber : customNumber).trim() || (overrideConfig ? '12' : '26');
    const activeBadgeType = overrideConfig ? overrideConfig.badgeType : badgeType;
    const activeHasLeaguePatch = overrideConfig ? overrideConfig.hasLeaguePatch : hasLeaguePatch;
    const activeIsFrontView = overrideConfig ? overrideConfig.isFrontView : isFrontView;

    const drawBody = (
      kitType: KitType,
      badgeType: BadgeType,
      hasLeaguePatch: boolean,
      isFrontView: boolean,
      dispName: string,
      dispNum: string
    ) => {
      const config = KIT_CONFIGS[kitType];
      const hasStandardLogo = badgeType === 'Standard Crest' || badgeType === 'Champions Gold';
      const hasGoldOverlay = badgeType === 'Champions Gold';

      if (isFrontView) {
      // FRONT VIEW SVG
      return (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl" id="jersey_front_svg">
          {/* Base definition layers */}
          <defs>
            <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </radialGradient>
            
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.baseColor} />
              <stop offset="50%" stopColor={config.baseColor} stopOpacity={0.95} />
              <stop offset="100%" stopColor={config.baseColor} stopOpacity={0.8} />
            </linearGradient>

            {/* Pattern stripes for aesthetic variation */}
            {kitType === 'Home' && (
              <pattern id="homeStripes" width="40" height="40" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="40" stroke={config.stripeColor} strokeWidth="1" strokeOpacity="0.3" />
                <line x1="20" y1="0" x2="20" y2="40" stroke={config.stripeColor} strokeWidth="0.5" strokeOpacity="0.15" />
              </pattern>
            )}

            {kitType === 'Away' && (
              <pattern id="awayDiamonds" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 10,0 L 20,10 L 10,20 L 0,10 Z" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.04" />
              </pattern>
            )}

            {kitType === 'Third' && (
              <pattern id="royalStripes" width="24" height="20" patternUnits="userSpaceOnUse">
                <rect width="4" height="20" fill={config.stripeColor} fillOpacity="0.12" />
              </pattern>
            )}

            {kitType === 'Goalkeeper' && (
              <pattern id="cyberMatrix" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="3" fill="#000000" fillOpacity="0.15" />
                <path d="M 0,15 L 30,15 M 15,0 L 15,30" stroke="#000000" strokeWidth="0.5" strokeOpacity="0.12" />
              </pattern>
            )}
          </defs>

          {/* Background backdrop glow */}
          <circle cx="200" cy="200" r="160" fill="url(#stadiumGlow)" />

          <g id="jersey_mesh">
            {/* Left Sleeve */}
            <path 
              d="M 110,130 L 60,180 L 90,210 L 130,165 Z" 
              fill="url(#bodyGradient)" 
              stroke="#000000" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
            />
            {/* Left sleeve cuff */}
            <path d="M 60,180 L 90,210" stroke={config.accentColor} strokeWidth="6" strokeLinecap="round" />

            {/* Right Sleeve */}
            <path 
              d="M 290,130 L 340,180 L 310,210 L 270,165 Z" 
              fill="url(#bodyGradient)" 
              stroke="#000000" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
            />
            {/* Right sleeve cuff */}
            <path d="M 340,180 L 310,210" stroke={config.accentColor} strokeWidth="6" strokeLinecap="round" />

            {/* Jersey Main Body */}
            <path 
              d="M 130,110 L 270,110 L 290,165 L 290,320 L 110,320 L 110,165 Z" 
              fill="url(#bodyGradient)" 
              stroke="#1e293b" 
              strokeWidth="2" 
              strokeLinejoin="round" 
            />

            {/* Pattern Overlay fills */}
            {kitType === 'Home' && (
              <path d="M 130,110 L 270,110 L 290,165 L 290,320 L 110,320 L 110,165 Z" fill="url(#homeStripes)" pointerEvents="none" />
            )}
            {kitType === 'Away' && (
              <path d="M 130,110 L 270,110 L 290,165 L 290,320 L 110,320 L 110,165 Z" fill="url(#awayDiamonds)" pointerEvents="none" />
            )}
            {kitType === 'Third' && (
              <path d="M 130,110 L 270,110 L 290,165 L 290,320 L 110,320 L 110,165 Z" fill="url(#royalStripes)" pointerEvents="none" />
            )}
            {kitType === 'Goalkeeper' && (
              <path d="M 130,110 L 270,110 L 290,165 L 290,320 L 110,320 L 110,165 Z" fill="url(#cyberMatrix)" pointerEvents="none" />
            )}

            {/* Bottom Hemline boarder */}
            <path d="M 110,320 L 290,320" stroke={config.accentColor} strokeWidth="4" />

            {/* Premium Collar V-Neck design */}
            <path d="M 170,110 Q 200,145 230,110 Z" fill={config.collarColor} stroke={config.accentColor} strokeWidth="2.5" />
            <path d="M 170,110 L 230,110" stroke={config.collarColor} strokeWidth="3" />

            {/* Gold championship badge center or standard chest additions */}
            {hasStandardLogo && (
              <>
                {/* Official Crest Left Side */}
                <g transform="translate(150, 160) scale(0.6)">
                  {/* Shield frame */}
                  <path d="M 0,-15 Q 12,-15 15,0 Q 15,15 0,25 Q -15,15 -15,0 Q -15,-15 0,-15 Z" fill={hasGoldOverlay ? '#f59e0b' : config.collarColor} stroke={hasGoldOverlay ? '#fff' : config.secondaryColor} strokeWidth="2" />
                  {/* Inner star detail */}
                  <polygon points="0,-6 2,-1 7,-1 3,2 5,7 0,4 -5,7 -3,2 -7,-1 -2,-1" fill={hasGoldOverlay ? '#fff' : '#f59e0b'} />
                </g>
              </>
            )}

            {/* Manufacturer Brand emblem on Right chest */}
            <g transform="translate(245, 155) scale(0.5)" opacity="0.95">
              <polygon points="0,15 10,0 20,15" fill={config.accentColor} />
              <polygon points="12,15 22,2 32,15" fill={config.accentColor} />
            </g>

            {/* Front Sponsor Text */}
            <g transform="translate(200, 235)">
              <text 
                textAnchor="middle" 
                fill={config.sponsorColor} 
                fontSize="24" 
                fontWeight="900" 
                letterSpacing="4"
                fontFamily="sans-serif"
                opacity="0.9"
              >
                APEX POWER
              </text>
              <text 
                textAnchor="middle" 
                fill={config.accentColor || '#ffffff'} 
                fontSize="7.5" 
                fontWeight="bold" 
                letterSpacing="5" 
                fontFamily="monospace"
                y="15"
                opacity="0.8"
              >
                GEN-AI SUSTAINABILITY
              </text>
            </g>

            {/* Gold Premier Badge on Sleeves */}
            {hasLeaguePatch && (
              <g transform="translate(75, 185) rotate(-35) scale(0.4)">
                <circle cx="0" cy="0" r="16" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <path d="M-6,3 L0,-7 L6,3 Z" fill="#fff" />
                <circle cx="0" cy="6" r="3" fill="#fff" />
              </g>
            )}
          </g>

          {/* Visual Overlay Tag */}
          <rect x="290" y="275" width="4" height="20" fill="#f59e0b" rx="1" />
          <text x="115" y="310" fill="#ffffff" fillOpacity="0.4" fontSize="8" fontFamily="monospace">GENUINE APEX AUTHENTIC</text>
        </svg>
      );
    } else {
      // BACK VIEW SVG
      return (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl" id="jersey_back_svg">
          {/* Base definition layers */}
          <defs>
            <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </radialGradient>
            
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.baseColor} />
              <stop offset="50%" stopColor={config.baseColor} stopOpacity={0.95} />
              <stop offset="100%" stopColor={config.baseColor} stopOpacity={0.8} />
            </linearGradient>

            {/* Pattern stripes */}
            {kitType === 'Home' && (
              <pattern id="homeStripesBack" width="40" height="40" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="40" stroke={config.stripeColor} strokeWidth="1" strokeOpacity="0.3" />
                <line x1="20" y1="0" x2="20" y2="40" stroke={config.stripeColor} strokeWidth="0.5" strokeOpacity="0.15" />
              </pattern>
            )}

            {kitType === 'Away' && (
              <pattern id="awayDiamondsBack" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 10,0 L 20,10 L 10,20 L 0,10 Z" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.04" />
              </pattern>
            )}

            {kitType === 'Third' && (
              <pattern id="royalStripesBack" width="24" height="20" patternUnits="userSpaceOnUse">
                <rect width="4" height="20" fill={config.stripeColor} fillOpacity="0.12" />
              </pattern>
            )}

            {kitType === 'Goalkeeper' && (
              <pattern id="cyberMatrixBack" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="3" fill="#000000" fillOpacity="0.15" />
                <path d="M 0,15 L 30,15 M 15,0 L 15,30" stroke="#000000" strokeWidth="0.5" strokeOpacity="0.12" />
              </pattern>
            )}
          </defs>

          {/* Background backdrop glow */}
          <circle cx="200" cy="200" r="160" fill="url(#stadiumGlow)" />

          <g id="jersey_mesh_back">
            {/* Left Sleeve (Viewing Back: Left/Right side flipped) */}
            <path 
              d="M 110,130 L 60,180 L 90,210 L 130,165 Z" 
              fill="url(#bodyGradient)" 
              stroke="#000000" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
            />
            {/* sleeve trim */}
            <path d="M 60,180 L 90,210" stroke={config.accentColor} strokeWidth="6" strokeLinecap="round" />

            {/* Right Sleeve */}
            <path 
              d="M 290,130 L 340,180 L 310,210 L 270,165 Z" 
              fill="url(#bodyGradient)" 
              stroke="#000000" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
            />
            {/* sleeve trim */}
            <path d="M 340,180 L 310,210" stroke={config.accentColor} strokeWidth="6" strokeLinecap="round" />

            {/* Jersey Body */}
            <path 
              d="M 130,110 L 270,110 L 290,165 L 290,320 L 110,320 L 110,165 Z" 
              fill="url(#bodyGradient)" 
              stroke="#1e293b" 
              strokeWidth="2" 
              strokeLinejoin="round" 
            />

            {/* Pattern Overlay fills */}
            {kitType === 'Home' && (
              <path d="M 130,110 L 270,110 L 290,165 L 290,320 L 110,320 L 110,165 Z" fill="url(#homeStripesBack)" pointerEvents="none" />
            )}
            {kitType === 'Away' && (
              <path d="M 130,110 L 270,110 L 290,165 L 290,320 L 110,320 L 110,165 Z" fill="url(#awayDiamondsBack)" pointerEvents="none" />
            )}
            {kitType === 'Third' && (
              <path d="M 130,110 L 270,110 L 290,165 L 290,320 L 110,320 L 110,165 Z" fill="url(#royalStripesBack)" pointerEvents="none" />
            )}
            {kitType === 'Goalkeeper' && (
              <path d="M 130,110 L 270,110 L 290,165 L 290,320 L 110,320 L 110,165 Z" fill="url(#cyberMatrixBack)" pointerEvents="none" />
            )}

            {/* Bottom Hemline border */}
            <path d="M 110,320 L 290,320" stroke={config.accentColor} strokeWidth="4" />

            {/* Back Collar curved line */}
            <path d="M 170,110 Q 200,125 230,110 Z" fill={config.collarColor} stroke={config.accentColor} strokeWidth="2" />
            <path d="M 170,110 L 230,110" stroke={config.collarColor} strokeWidth="2.5" />

            {/* CUSTOM PLAYER NAME */}
            <g transform="translate(200, 160)">
              <text 
                textAnchor="middle" 
                fill={config.textColor} 
                fontSize="18" 
                fontWeight="900" 
                fontFamily="sans-serif"
                letterSpacing="1.5"
                className="font-sans antialiased text-white select-none"
              >
                {dispName}
              </text>
            </g>

            {/* CUSTOM PLAYER NUMBER */}
            <g transform="translate(200, 248)">
              <text 
                textAnchor="middle" 
                fill={config.textColor} 
                fontSize="85" 
                fontWeight="900" 
                fontFamily="sans-serif"
                letterSpacing="-3"
                className="font-sans antialiased text-white font-black select-none"
              >
                {dispNum}
              </text>
            </g>

            {/* Tiny Emblem crest above name */}
            <circle cx="200" cy="135" r="4.5" fill={config.accentColor} opacity="0.8" />
            <path d="M 197,135 Q 200,132 203,135 Q 200,140 197,135 Z" fill="#ffffff" opacity="0.6" />
          </g>

          <text x="145" y="310" fill="#ffffff" fillOpacity="0.25" fontSize="8" fontFamily="monospace">OFFICIAL LICENSED PRODUCT</text>
        </svg>
      );
    }
  };

  return drawBody(
    activeKitType,
    activeBadgeType,
    activeHasLeaguePatch,
    activeIsFrontView,
    activeCustomName,
    activeCustomNumber
  );
};

  return (
    <div id="jersey_store_module" className="space-y-8">
      
      {/* Dynamic Upper Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/40 border border-emerald-900/30 px-3 py-1.5 rounded-lg select-none">
            Fanstore & Apparel
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-white mt-3 font-sans flex items-center gap-2">
            <Shirt className="w-5.5 h-5.5 text-emerald-400 stroke-[1.8]" /> Apex Customized Jersey Store
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Draw custom Home, Away, or Goalkeeper kits. Tailor nameplates, numbers, size layouts, and secure orders.
          </p>
        </div>
        
        {/* Floating Cart trigger indicator & Admin View Selector Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Mode Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 shrink-0">
            <button
              type="button"
              onClick={() => setActiveViewMode('store')}
              className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeViewMode === 'store'
                  ? 'bg-emerald-600/15 border border-emerald-800/40 text-emerald-400 font-bold'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Customizer Shop
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('orders')}
              className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeViewMode === 'orders'
                  ? 'bg-emerald-600/15 border border-emerald-800/40 text-emerald-400 font-bold'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Order Board ({orders.length})
            </button>
          </div>

          <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-850 flex items-center gap-3">
            <ShoppingBag className="w-4.5 h-4.5 text-emerald-400" />
            <div className="font-mono text-xs">
              <span className="text-slate-400 mr-2">Cart:</span>
              <span className="text-white font-bold">{cart.length} item(s)</span>
            </div>
            {cart.length > 0 && (
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
            )}
          </div>
        </div>
      </div>

      {/* Visualizer and Customizer workspace wrapper */}
      {activeViewMode === 'store' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT COLUMN: Jersey visualizer framework (xl:col-span-5) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-slate-900/50 border border-slate-850 rounded-3xl p-6 relative flex flex-col items-center justify-center min-h-[420px] shadow-sm select-none">
            
            {/* View angle toggles overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <span className="text-[10px] font-mono text-slate-500 bg-slate-950/80 border border-slate-850 px-2.5 py-1 rounded-md">
                Angle: <span className="text-amber-400 font-bold">{isFrontView ? 'FRONT INTERIOR' : 'BACK NAMEPLATE'}</span>
              </span>
              
              <button
                onClick={() => setIsFrontView(prev => !prev)}
                className="flex items-center gap-1 bg-slate-950 hover:bg-slate-900 text-[10px] font-mono font-bold text-emerald-400 border border-slate-800 px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Switch to {isFrontView ? 'Back' : 'Front'} View
              </button>
            </div>

            {/* Jersey drawing component with animate change animations */}
            <div className="w-full max-w-[340px] aspect-square flex items-center justify-center p-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={kitType + '_' + isFrontView + '_' + customName + '_' + customNumber + '_' + badgeType + '_' + hasLeaguePatch}
                  initial={{ opacity: 0, scale: 0.95, rotateY: isFrontView ? 10 : -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  {renderJerseyVector()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sub-viewer guidelines banner */}
            <div className="w-full mt-4 text-center">
              <p className="text-[10px] font-mono text-slate-400 leading-normal max-w-xs mx-auto">
                Sleeves carry the official golden Champion Star badges when selected. All elements updated in real-time.
              </p>
            </div>
          </div>

          {/* Quick Roster Import List panel (Integrates with Squad data as requested) */}
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850/60 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-200">Inject Squad Member</h4>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Click to apply customization</span>
            </div>

            {players.length === 0 ? (
              <p className="text-[10px] font-mono text-slate-500 text-center py-2">No roster players detected inside sandbox</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                {players.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => injectPlayerPreset(p)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 hover:bg-emerald-950/20 hover:border-emerald-900 border border-slate-850 text-left transition-all group cursor-pointer"
                  >
                    <div className="truncate pr-1">
                      <p className="text-[10px] text-slate-400 group-hover:text-emerald-400 transition-colors font-mono font-bold truncate leading-tight">
                        {p.name.split(' ').pop()}
                      </p>
                      <span className="text-[8px] font-mono text-slate-500 uppercase">{p.position}</span>
                    </div>
                    <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-950/80 px-2 py-0.5 rounded-lg shrink-0">
                      #{p.number}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE CONFIG COLUMNS: Customizer control settings (xl:col-span-4) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 space-y-6 shadow-sm">
            
            <div className="border-b border-slate-850/60 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-emerald-400" /> Customizer Workbench
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">Tailor materials, sleeve configurations and identity prints</p>
            </div>

            {/* 1. Kit Colorways selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400 block">
                1. Select Kit Apparel Design
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(Object.keys(KIT_CONFIGS) as KitType[]).map((kit) => {
                  const isActive = kitType === kit;
                  return (
                    <button
                      key={kit}
                      onClick={() => {
                        setKitType(kit);
                        if (kit === 'Goalkeeper') {
                          setIsFrontView(true); // GKs look epic from front
                        }
                      }}
                      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isActive 
                          ? 'bg-emerald-955/20 border-emerald-600/65 shadow-md shadow-emerald-950/20' 
                          : 'bg-slate-950/40 border-slate-850 hover:bg-slate-950/80'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/10" 
                          style={{ backgroundColor: KIT_CONFIGS[kit].baseColor }}
                        ></span>
                        <span className="text-[10px] font-bold text-white font-mono">{kit}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-sans tracking-tight leading-snug line-clamp-1">
                        {KIT_CONFIGS[kit].name}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 italic font-mono leading-relaxed bg-slate-950/30 p-2 rounded-xl">
                {currentConfig.description}
              </p>
            </div>

            {/* 2. Personalize Text inputs */}
            <div className="space-y-3 pt-4 border-t border-slate-850/60">
              <label className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400 block">
                2. Customize Name & Squad Number
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Nameplate (Max 12)</span>
                  <input
                    type="text"
                    maxLength={12}
                    value={customName}
                    onChange={(e) => {
                      // Filter letters and spaces
                      const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
                      setCustomName(filtered);
                      setIsFrontView(false); // Back view represents nameplate changes nicely
                    }}
                    placeholder="STERLING"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-mono text-white text-center uppercase"
                  />
                </div>
                
                <div className="col-span-1 space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Number</span>
                  <input
                    type="text"
                    maxLength={2}
                    value={customNumber}
                    onChange={(e) => {
                      const num = e.target.value.replace(/[^0-9]/g, '');
                      setCustomNumber(num);
                      setIsFrontView(false);
                    }}
                    placeholder="10"
                    className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-600 focus:outline-none rounded-xl px-3 py-2 text-xs font-mono text-white text-center"
                  />
                </div>
              </div>
            </div>

            {/* 3. Size Select Layout */}
            <div className="space-y-3 pt-4 border-t border-slate-850/60 font-sans">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400 block">
                  3. Choose Proper Fit Size
                </label>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer bg-none border-none outline-none transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-emerald-450 stroke-[2]" /> Size Guide
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as JerseySize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`h-9 w-9 flex items-center justify-center rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      size === s
                        ? 'bg-emerald-600/15 border-emerald-600 text-emerald-400 font-extrabold'
                        : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:bg-slate-950'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Badges and sleeve additions */}
            <div className="space-y-3.5 pt-4 border-t border-slate-850/60 text-xs text-slate-300">
              <label className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400 block">
                4. Select Badges & Embellishments
              </label>

              {/* Badge selector list */}
              <div className="space-y-2">
                {[
                  { type: 'Champions Gold' as BadgeType, label: 'Gold Champion Gold Crest', cost: '+$15.00', desc: 'Sovereign gold edition crest centered on the front fabric mesh.' },
                  { type: 'Standard Crest' as BadgeType, label: 'Standard Embroidered Crest', cost: '+$5.00', desc: 'Standard club emerald-green shield woven detailing.' },
                  { type: 'None' as BadgeType, label: 'No Crest / Minimalist Look', cost: '+$0.00', desc: 'Clean, clean layout style without central shields.' }
                ].map((item) => (
                  <label 
                    key={item.type}
                    onClick={() => setBadgeType(item.type)} 
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      badgeType === item.type 
                        ? 'bg-slate-950 border-emerald-800' 
                        : 'bg-slate-950/30 border-slate-850 hover:bg-slate-950/50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="badge_setup" 
                      checked={badgeType === item.type}
                      onChange={() => {}} // handled by onClick
                      className="accent-emerald-500 mt-0.5 pointer-events-none" 
                    />
                    <div className="flex-1">
                      <div className="flex justify-between font-bold text-xs">
                        <span className="text-slate-200">{item.label}</span>
                        <span className="text-emerald-400 font-mono text-[11px]">{item.cost}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Sleeve League badge check */}
              <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-850/60 flex items-center justify-between cursor-pointer" onClick={() => setHasLeaguePatch(prev => !prev)}>
                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox" 
                    checked={hasLeaguePatch}
                    onChange={() => {}}
                    className="accent-emerald-500 pointer-events-none" 
                  />
                  <div>
                    <span className="font-bold text-slate-200 text-xs block">Premier Golden Sleeve Patch</span>
                    <span className="text-[10px] text-slate-500 font-mono block">Applied to right side sleeve wrap</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">+$5.00</span>
              </div>
            </div>

            {/* WORKBENCH PRICE PANEL */}
            <div className="pt-5 border-t border-slate-850/80 flex items-center justify-between bg-slate-950/55 -mx-6 -mb-6 p-6 rounded-b-3xl">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">Unit Cost Configured</span>
                <span className="text-xl font-black text-white tracking-tight">${currentSingleItemPrice.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={addToCart}
                className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-md shadow-emerald-950/30 transition-all active:scale-95 cursor-pointer leading-none"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Shopping Bag Cart Summary (xl:col-span-3) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 space-y-5 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-slate-850/60 pb-3">
              <h3 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" /> Shopping Bag ({cart.length})
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[9px] font-mono text-rose-400 hover:underline hover:text-rose-300 cursor-pointer"
                >
                  Clear Bag
                </button>
              )}
            </div>

            {/* List customizer items inside cart */}
            {cart.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-slate-950/40 rounded-full border border-slate-800 text-slate-600">
                  <ShoppingBag className="w-6 h-6 stroke-1" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 leading-none">Your bag is empty</p>
                  <p className="text-[10px] text-slate-500 font-mono">Customize above to load virtual orders</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                {cart.map((item) => {
                  const itemConfig = KIT_CONFIGS[item.customization.kitType];
                  return (
                    <div 
                      key={item.id} 
                      className="bg-slate-950/80 border border-slate-850/60 rounded-2xl p-3 flex flex-col gap-2 relative group hover:border-slate-800 transition-all"
                    >
                      {/* Delete index overlay */}
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="absolute top-2 right-2 text-slate-600 hover:text-rose-400 rounded transition-colors cursor-pointer"
                        title="Delete order item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Info header */}
                      <div className="flex gap-2.5">
                        {/* Swatch color bubble */}
                        <div 
                          className="w-8 h-8 rounded-xl shrink-0 border border-white/5 flex items-center justify-center font-mono font-black text-[10px]"
                          style={{ backgroundColor: itemConfig.baseColor, color: itemConfig.textColor }}
                        >
                          #{item.customization.customNumber}
                        </div>
                        
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-[11px] font-bold text-white truncate leading-snug">
                            {itemConfig.name}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate leading-none">
                            Size: {item.customization.size} | Badge: {item.customization.badgeType.split(' ')[0]}
                          </p>
                        </div>
                      </div>

                      {/* Customization variables lists banner */}
                      <div className="bg-slate-900/50 p-2 rounded-lg text-[9px] font-mono text-slate-500 flex flex-wrap gap-x-2 gap-y-1">
                        <span>Print: <strong className="text-amber-400">{item.customization.customName}</strong></span>
                        <span>•</span>
                        <span>Sleeves: <strong className={item.customization.hasLeaguePatch ? 'text-emerald-400' : 'text-slate-600'}>{item.customization.hasLeaguePatch ? 'GOLD' : 'NONE'}</strong></span>
                      </div>

                      {/* Footer pricing / count controls */}
                      <div className="flex items-center justify-between border-t border-slate-900/60 pt-2 text-[11px]">
                        <span className="font-mono text-white font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 px-2 py-1 rounded-xl">
                          <button 
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="text-slate-400 hover:text-white cursor-pointer px-1 text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="text-slate-400 hover:text-white cursor-pointer px-1 text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* COST BREAKDOWN ACCORDION */}
            {cart.length > 0 && (
              <div className="pt-3 border-t border-slate-850 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Cart Subtotal</span>
                  <span className="text-slate-200">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping Courier</span>
                  <span className="text-slate-200">
                    {cartShippingCost === 0 ? <strong className="text-emerald-400 font-sans">FREE</strong> : `$${cartShippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 font-sans font-black text-sm border-t border-slate-850/60 pt-2 pb-1">
                  <span>Final Total</span>
                  <span className="text-emerald-400 font-mono">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={initiateCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs tracking-tight shadow-md transition-all active:scale-95 cursor-pointer leading-none mt-2 font-sans"
                >
                  <CreditCard className="w-4 h-4" /> Proceed to Checkout
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
      ) : (
        /* ADMIN ORDERS DASHBOARD BOARD */
        <div id="jersey_admin_dashboard" className="space-y-6">
          
          {/* Admin Metric Widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Total Fan Purchases</span>
              <p className="text-2xl font-black text-white font-sans">{orders.length}</p>
              <span className="text-[10px] text-slate-400 block font-mono">Completed checkouts</span>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Gross Store Revenue</span>
              <p className="text-2xl font-black text-emerald-400 font-sans">
                ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
              </p>
              <span className="text-[10px] text-emerald-500/80 block font-mono">100% fan merchandise</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Active In-Customization</span>
              <p className="text-2xl font-black text-amber-400 font-sans">
                {orders.filter(o => ['Tailoring', 'Printing Nameplate', 'Pending'].includes(o.status)).length}
              </p>
              <span className="text-[10px] text-amber-500/80 block font-mono">Tailors actively crafting</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Shipped & Dispatched</span>
              <p className="text-2xl font-black text-indigo-100 font-sans">
                {orders.filter(o => ['Shipped', 'Delivered', 'Ready to Dispatch'].includes(o.status)).length}
              </p>
              <span className="text-[10px] text-indigo-500/80 block font-mono">Sent to courier network</span>
            </div>
          </div>

          {/* Sub-tabs inside Order Board: List, Analytics, Custom Builder */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-850">
            {(['list', 'analytics', 'builder'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveAdminTab(tab)}
                className={`flex-1 py-2.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                  activeAdminTab === tab
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/20 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'list' && `Registered Orders List (${orders.length})`}
                {tab === 'analytics' && 'Sales & Apparel Analytics'}
                {tab === 'builder' && 'Manual Direct Order Draft Builder'}
              </button>
            ))}
          </div>

          {activeAdminTab === 'list' && (
            <div className="space-y-4">
              {/* Controls Bar for Administration */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
                {/* Search Input Box */}
                <div className="relative flex-1 max-w-md">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search invoice number, buyer, print name, or country..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Direct Create Club Order button */}
                <button
                  type="button"
                  onClick={handleCreateMockOrder}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" /> Direct Club Kit Order
                </button>
              </div>

              {/* Status filtering tabs rail */}
              <div className="flex flex-wrap gap-2 border-b border-slate-850 pb-1">
                {['All', 'Pending', 'Tailoring', 'Printing Nameplate', 'Ready to Dispatch', 'Shipped', 'Delivered'].map((st) => {
                  const count = st === 'All' ? orders.length : orders.filter(o => o.status === st).length;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`text-xs font-mono px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        statusFilter === st
                          ? 'bg-emerald-600/10 border-emerald-500/50 text-emerald-400 font-bold'
                          : 'border-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-900'
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Orders Lists and Content */}
              <div className="space-y-4">
                {orders.filter(o => {
                  const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
                  
                  const q = searchQuery.toLowerCase().trim();
                  if (!q) return matchesStatus;

                  const matchesInvoice = o.id.toLowerCase().includes(q);
                  const matchesName = o.shippingName.toLowerCase().includes(q);
                  const matchesEmail = o.shippingEmail.toLowerCase().includes(q);
                  const matchesAddress = o.shippingAddress.toLowerCase().includes(q);
                  
                  // Map over item properties (print nameplate etc)
                  const matchesProducts = o.items.some(item => 
                    item.customization.customName.toLowerCase().includes(q) || 
                    KIT_CONFIGS[item.customization.kitType].name.toLowerCase().includes(q)
                  );

                  return matchesStatus && (matchesInvoice || matchesName || matchesEmail || matchesAddress || matchesProducts);
                }).length === 0 ? (
                  <div className="p-12 border border-dashed border-slate-850 rounded-2xl text-center text-slate-500 space-y-2">
                    <Package className="w-10 h-10 text-slate-700 mx-auto" />
                    <p className="text-xs font-mono font-bold uppercase text-slate-400">No matching jersey orders found</p>
                    <p className="text-[11px] font-sans">Modify filters or click "Direct Club Kit Order" to create a sample.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders
                      .filter(o => {
                        const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
                        
                        const q = searchQuery.toLowerCase().trim();
                        if (!q) return matchesStatus;

                        const matchesInvoice = o.id.toLowerCase().includes(q);
                        const matchesName = o.shippingName.toLowerCase().includes(q);
                        const matchesEmail = o.shippingEmail.toLowerCase().includes(q);
                        const matchesAddress = o.shippingAddress.toLowerCase().includes(q);
                        
                        const matchesProducts = o.items.some(item => 
                          item.customization.customName.toLowerCase().includes(q) || 
                          KIT_CONFIGS[item.customization.kitType].name.toLowerCase().includes(q)
                        );

                        return matchesStatus && (matchesInvoice || matchesName || matchesEmail || matchesAddress || matchesProducts);
                      })
                      .map((order) => {
                        return (
                          <div 
                            key={order.id} 
                            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between"
                          >
                            {/* Order Header bar */}
                            <div className="p-4 bg-slate-950/50 border-b border-slate-850 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-mono text-emerald-400 font-bold block bg-emerald-950/50 border border-emerald-900/30 px-2 py-0.5 rounded">
                                  {order.id}
                                </span>
                                <span className="text-[9px] font-mono text-slate-500 block">
                                  {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              {/* Colored status pills */}
                              <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold select-none ${
                                order.status === 'Pending' ? 'bg-slate-950 border border-slate-800 text-slate-400' :
                                order.status === 'Tailoring' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
                                order.status === 'Printing Nameplate' ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400' :
                                order.status === 'Ready to Dispatch' ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400' :
                                order.status === 'Shipped' ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300' :
                                'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                              }`}>
                                {order.status}
                              </span>
                            </div>

                            {/* Order info details */}
                            <div className="p-4 space-y-3.5 flex-1">
                              
                              {/* Products breakdown */}
                              <div className="space-y-2">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Kits Ordered</span>
                                {order.items.map((item, idx) => {
                                  const config = KIT_CONFIGS[item.customization.kitType];
                                  return (
                                    <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850/60 flex items-center justify-between">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div 
                                          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 outline-dashed outline-1 outline-offset-1 outline-slate-700/60"
                                          style={{ backgroundColor: config.baseColor, color: config.textColor }}
                                        >
                                          {item.customization.customNumber || '??'}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-white truncate">{item.quantity}x {config.name}</p>
                                          <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                                            Size {item.customization.size} | Badge: {item.customization.badgeType.split(' ')[0]}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="text-right shrink-0">
                                        <p className="text-[10px] font-mono text-amber-400 font-bold">
                                          "{item.customization.customName || 'NAMEPLATE'}"
                                        </p>
                                        <p className="text-[10px] font-mono text-slate-550 mt-0.5">#{item.customization.customNumber}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Shipping coordinates */}
                              <div className="space-y-1 p-2.5 bg-slate-950/20 border border-slate-850/30 rounded-xl text-[11px]">
                                <p className="text-slate-400"><strong className="text-white font-sans">{order.shippingName}</strong></p>
                                <p className="text-slate-500 truncate">{order.shippingAddress}</p>
                                <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-500 pt-1 font-mono">
                                  <span>✉ {order.shippingEmail}</span>
                                  <span>☎ {order.shippingPhone}</span>
                                </div>
                              </div>

                            </div>

                            {/* Invoice and audit control buttons */}
                            <div className="px-4 py-3 bg-slate-950/30 border-t border-slate-850/60 flex items-center justify-between">
                              <div className="font-mono text-xs">
                                <span className="text-slate-550 mr-2">Received:</span>
                                <strong className="text-white">${order.total.toFixed(2)}</strong>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Edit triggers sheet */}
                                <button
                                  type="button"
                                  onClick={() => handleStartEditOrder(order)}
                                  className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 rounded-lg hover:border-emerald-950 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-sans"
                                >
                                  <Edit className="w-3.5 h-3.5" /> Edit Order
                                </button>
                                {/* Delete order */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1.5 bg-slate-900 border border-slate-800 text-slate-550 hover:text-rose-450 rounded-lg hover:border-rose-950 transition-all cursor-pointer"
                                  title="Delete Order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeAdminTab === 'analytics' && (() => {
            // Analytics aggregation
            const kitCounts = { Home: 0, Away: 0, Third: 0, Goalkeeper: 0 };
            const sizeCounts = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
            const statusCounts = { Pending: 0, Tailoring: 0, 'Printing Nameplate': 0, 'Ready to Dispatch': 0, Shipped: 0, Delivered: 0 };
            let customizedCount = 0;
            let standardCount = 0;

            orders.forEach(o => {
              if (statusCounts[o.status] !== undefined) {
                statusCounts[o.status]++;
              }
              o.items.forEach(it => {
                const kt = it.customization.kitType;
                if (kitCounts[kt] !== undefined) {
                  kitCounts[kt] += it.quantity;
                }
                const sz = it.customization.size;
                if (sizeCounts[sz] !== undefined) {
                  sizeCounts[sz] += it.quantity;
                }
                if (it.customization.customName || it.customization.customNumber) {
                  customizedCount += it.quantity;
                } else {
                  standardCount += it.quantity;
                }
              });
            });

            const totalOrdersCount = orders.length;
            const totalJerseysSold = Object.values(kitCounts).reduce((a, b) => a + b, 0);
            const grossRevenue = orders.reduce((sum, o) => sum + o.total, 0);
            const averageOrderValue = totalOrdersCount > 0 ? grossRevenue / totalOrdersCount : 0;
            const personalizationRate = totalJerseysSold > 0 ? Math.round((customizedCount / totalJerseysSold) * 100) : 0;

            const chartKitData = [
              { name: 'Home', count: kitCounts.Home, fill: '#10b981' },
              { name: 'Away', count: kitCounts.Away, fill: '#3b82f6' },
              { name: 'Third', count: kitCounts.Third, fill: '#f59e0b' },
              { name: 'Goalkeeper', count: kitCounts.Goalkeeper, fill: '#db2777' },
            ];

            const chartSizeData = Object.keys(sizeCounts).map(sz => ({
              size: sz,
              Jerseys: (sizeCounts as any)[sz],
            }));

            return (
              <div className="space-y-6">
                
                {/* Visual Widgets Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950/45 border border-slate-850 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-505 uppercase tracking-widest block font-bold">Total Sales Qty</span>
                    <p className="text-xl font-extrabold text-white font-sans mt-1">{totalJerseysSold} unit(s)</p>
                    <div className="w-full bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-950/45 border border-slate-850 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest block font-bold">Average Order</span>
                    <p className="text-xl font-extrabold text-white font-sans mt-1">${averageOrderValue.toFixed(2)}</p>
                    <div className="w-full bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-950/45 border border-slate-850 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest block font-bold">Personalized Rate</span>
                    <p className="text-xl font-extrabold text-amber-400 font-sans mt-1">{personalizationRate}%</p>
                    <div className="w-full bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${personalizationRate}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-950/45 border border-slate-850 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-555 uppercase tracking-widest block font-bold">In-Tailoring (WIP)</span>
                    <p className="text-xl font-extrabold text-indigo-400 font-sans mt-1">
                      {statusCounts.Tailoring + statusCounts['Printing Nameplate']} items
                    </p>
                    <div className="w-full bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Analytical charts workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Chart 1: Kit Sales Volume */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div>
                      <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest">KIT DESIGN PREFERENCE</span>
                      <h4 className="text-xs font-bold text-slate-300 mt-1">Quantity of Jerseys Sold by Apparel Category</h4>
                    </div>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartKitData}>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                          <YAxis stroke="#64748b" fontSize={9} width={18} />
                          <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: 10 }} />
                          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Size Fit Distribution */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div>
                      <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest">SIZE FIT DEMAND</span>
                      <h4 className="text-xs font-bold text-slate-300 mt-1">Sizing Matrix Distribution Analysis</h4>
                    </div>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartSizeData}>
                          <XAxis dataKey="size" stroke="#64748b" fontSize={9} />
                          <YAxis stroke="#64748b" fontSize={9} width={18} />
                          <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: 10 }} />
                          <Bar dataKey="Jerseys" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* Status Workflows list */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div>
                    <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest">WORKSHOP BOTTLENECK ANALYSIS</span>
                    <h4 className="text-xs font-bold text-slate-300 mt-1">Current Tailoring and Supply Chain Backlog</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                    {[
                      { status: 'Pending Review', count: statusCounts.Pending, color: 'border-slate-800 text-slate-400' },
                      { status: 'Tailoring Workshop', count: statusCounts.Tailoring, color: 'border-amber-900/40 text-amber-400 bg-amber-950/10' },
                      { status: 'Nameplate Press', count: statusCounts['Printing Nameplate'], color: 'border-blue-900/40 text-blue-400 bg-blue-950/10' },
                      { status: 'Ready to Dispatch', count: statusCounts['Ready to Dispatch'], color: 'border-purple-900/40 text-purple-400 bg-purple-950/10' },
                      { status: 'With Courier', count: statusCounts.Shipped, color: 'border-indigo-900/40 text-indigo-300 bg-indigo-950/10' },
                      { status: 'Delivered', count: statusCounts.Delivered, color: 'border-emerald-900/40 text-emerald-400 bg-emerald-950/10' }
                    ].map((item, idx) => (
                      <div key={idx} className={`border rounded-xl p-3 text-center space-y-1 ${item.color}`}>
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wide block truncate">{item.status}</span>
                        <p className="text-xl font-black">{item.count}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })()}

          {activeAdminTab === 'builder' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Live Customizer Drawer Preview */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative flex flex-col items-center justify-center min-h-[420px] shadow-sm select-none">
                  
                  {/* Angle and Badge indicators */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950/80 border border-slate-850 px-2.5 py-1 rounded-md">
                      Angle: <span className="text-rose-450 font-bold">{isBuilderFrontView ? 'FRONT INTERIOR' : 'BACK NAMEPLATE'}</span>
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => setIsBuilderFrontView(prev => !prev)}
                      className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-[10px] font-mono font-bold text-rose-450 border border-slate-800 px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Switch to {isBuilderFrontView ? 'Back' : 'Front'}
                    </button>
                  </div>

                  {/* Jersey vector drawing */}
                  <div className="w-full max-w-[310px] aspect-square flex items-center justify-center p-2 mt-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={builderKitType + '_' + isBuilderFrontView + '_' + builderCustomName + '_' + builderCustomNumber + '_' + builderBadgeType + '_' + builderHasLeaguePatch}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full"
                      >
                        {renderJerseyVector({
                          kitType: builderKitType,
                          customName: builderCustomName,
                          customNumber: builderCustomNumber,
                          badgeType: builderBadgeType,
                          hasLeaguePatch: builderHasLeaguePatch,
                          isFrontView: isBuilderFrontView
                        })}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Specs footer label */}
                  <div className="w-full mt-4 p-4 bg-slate-950/40 rounded-2xl border border-slate-850/60 font-mono text-[11px] space-y-1.5 text-slate-400">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[9px] uppercase font-bold">Apparel Blueprint:</span>
                      <span className="text-white font-bold">{builderKitType} Kit ({builderSize})</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-850/40 pt-1.5">
                      <span className="text-slate-500 text-[9px] uppercase font-bold">Crest/Patch:</span>
                      <span>{builderBadgeType} {builderHasLeaguePatch && '+ League Patch'}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-850/40 pt-1.5">
                      <span className="text-slate-500 text-[9px] uppercase font-bold">Player Customizer:</span>
                      <span className="text-rose-450 font-bold truncate">"{builderCustomName || 'MANAGER'}" #{builderCustomNumber || '12'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 font-mono text-[11px] text-slate-400 space-y-2">
                  <span className="text-rose-500 font-black text-[9px] uppercase tracking-wider block">Admin Direct Pipeline</span>
                  <p className="leading-relaxed">This visualizer represents the live rendering blueprints that will be issued to our master tailoring machinery upon commitment.</p>
                </div>
              </div>

              {/* Right Column: Direct Order Draft Specification Builder Form */}
              <div className="lg:col-span-7">
                <form onSubmit={handleCreateBuilderOrder} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                  <div className="border-b border-slate-850 pb-3">
                    <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest">APEX TAILOR WORKSHOP</span>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mt-1">Create Manual Direct Order</h3>
                    <p className="text-xs text-slate-400 mt-1">Submit high-volume club merchandise and special team configurations directly to the tailoring workshop.</p>
                  </div>

                  {/* Grid 1: Customer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Recipient / Department Name</label>
                      <input
                        type="text"
                        required
                        value={builderName}
                        onChange={(e) => setBuilderName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Delivery Address Coordinates</label>
                      <input
                        type="text"
                        required
                        value={builderAddress}
                        onChange={(e) => setBuilderAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Department Email</label>
                      <input
                        type="email"
                        required
                        value={builderEmail}
                        onChange={(e) => setBuilderEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-610 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Department Phone</label>
                      <input
                        type="text"
                        required
                        value={builderPhone}
                        onChange={(e) => setBuilderPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-610 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Grid 2: Jersey Customizer Specifications */}
                  <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500 block border-b border-slate-850/60 pb-1.5">
                      Jersey Apparel Tailoring Specification
                    </span>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Kit Type</label>
                        <select
                          value={builderKitType}
                          onChange={(e) => setBuilderKitType(e.target.value as KitType)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        >
                          <option value="Home">Home Kit</option>
                          <option value="Away">Away Kit</option>
                          <option value="Third">Third Kit</option>
                          <option value="Goalkeeper">Goalkeeper Kit</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Size Fit</label>
                        <select
                          value={builderSize}
                          onChange={(e) => setBuilderSize(e.target.value as JerseySize)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        >
                          <option value="XS">XS Fit</option>
                          <option value="S">S Fit</option>
                          <option value="M">M Fit</option>
                          <option value="L">L Fit</option>
                          <option value="XL">XL Fit</option>
                          <option value="XXL">XXL Fit</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Badge Crest</label>
                        <select
                          value={builderBadgeType}
                          onChange={(e) => setBuilderBadgeType(e.target.value as BadgeType)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        >
                          <option value="Standard Crest">Standard Crest</option>
                          <option value="Champions Gold">Champions Gold</option>
                          <option value="None">None</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Sleeve Badges</label>
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={builderHasLeaguePatch}
                            onChange={(e) => setBuilderHasLeaguePatch(e.target.checked)}
                            className="w-4 h-4 rounded bg-slate-900 border-slate-800 accent-rose-500 cursor-pointer"
                            id="builder_league_badge"
                          />
                          <label htmlFor="builder_league_badge" className="text-xs text-slate-300 font-sans cursor-pointer select-none">League Patch</label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-850">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Name Plate Print</label>
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="e.g. SQUAD"
                          value={builderCustomName}
                          onChange={(e) => setBuilderCustomName(e.target.value.toUpperCase())}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono uppercase text-white placeholder-slate-655 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Jersey Number</label>
                        <input
                          type="text"
                          maxLength={2}
                          placeholder="e.g. 10"
                          value={builderCustomNumber}
                          onChange={(e) => setBuilderCustomNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-905 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white placeholder-slate-655 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={builderQuantity}
                          onChange={(e) => setBuilderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Price Per Jersey ($)</label>
                        <input
                          type="number"
                          min="10"
                          max="500"
                          value={builderPrice}
                          onChange={(e) => setBuilderPrice(Math.max(1, parseInt(e.target.value) || 85))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => {
                        setBuilderName('Arena Manager - ground 4');
                        setBuilderCustomName('MANAGER');
                        setBuilderCustomNumber('12');
                        setBuilderQuantity(1);
                        setBuilderPrice(85);
                      }}
                      className="px-4 py-2 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-xs text-slate-400 rounded-xl transition-colors font-bold cursor-pointer"
                    >
                      Clear Specifications
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-xs text-white rounded-xl shadow-lg transition-all font-bold cursor-pointer hover:shadow-rose-900/30"
                    >
                      Commit Order Draft to Live Board
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* FULL CHECKOUT / SECURE TRANSACTION PROCESS DIALOG WALLET */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              
              {/* Header Wizard progress */}
              <div className="p-6 border-b border-slate-850 shrink-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShoppingBag className="w-4.5 h-4.5 text-emerald-400" /> Secure Fanstore Cashier
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-mono">Apex United Licensed Apparel Portal</p>
                  </div>
                  {checkoutStep !== 3 && (
                    <button
                      onClick={() => setIsCheckoutOpen(false)}
                      className="p-1.5 bg-slate-950 text-slate-400 border border-slate-850 rounded-lg hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Micro step tracker bar */}
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] font-mono leading-none">
                  <div className={`p-1.5 rounded ${checkoutStep >= 1 ? 'bg-emerald-600/10 text-emerald-400 font-black border border-emerald-800/40' : 'bg-slate-950 text-slate-500 border border-transparent'}`}>
                    1. Shipping
                  </div>
                  <div className={`p-1.5 rounded ${checkoutStep >= 2 ? 'bg-emerald-600/10 text-emerald-400 font-black border border-emerald-800/40' : 'bg-slate-950 text-slate-500 border border-transparent'}`}>
                    2. Payment
                  </div>
                  <div className={`p-1.5 rounded ${checkoutStep >= 3 ? 'bg-emerald-600/10 text-emerald-400 font-black border border-emerald-800/40' : 'bg-slate-950 text-slate-500 border border-transparent'}`}>
                    3. Sovereign Invoice
                  </div>
                </div>
              </div>

              {/* Checkout Form Content */}
              <div className="overflow-y-auto p-6 max-h-[60vh] custom-scrollbar flex-1">
                
                {/* STEP 1: SHIPPING DETAILS */}
                {checkoutStep === 1 && (
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="bg-slate-950/40 p-4 border border-slate-850/60 rounded-2xl flex items-start gap-3 text-xs mb-2">
                      <Info className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="text-slate-200">Sandbox Auto-Fill Enabled</strong>
                        <p className="text-[10px] text-slate-400 leading-normal font-mono">
                          We pre-loaded standard fan variables so you can test transitions seamlessly inside the browser iframe.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Recipient Name</label>
                      <input 
                        type="text" 
                        required
                        value={shippingName} 
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder="Aston Sterling" 
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Delivery Street Address</label>
                      <input 
                        type="text" 
                        required
                        value={shippingAddress} 
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="e.g. 44 Apex Road, Stadium Heights" 
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={shippingEmail} 
                          onChange={(e) => setShippingEmail(e.target.value)}
                          placeholder="fan@apexunitedfc.com" 
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Phone Contact</label>
                        <input 
                          type="text" 
                          required
                          value={shippingPhone} 
                          onChange={(e) => setShippingPhone(e.target.value)}
                          placeholder="+44 7911 123456" 
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-850 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-500">Fast Express Shipping</span>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: SIMULATED PAYMENT FOR CREDIT CARD CARD DECK */}
                {checkoutStep === 2 && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    
                    {/* Visual credit card layout */}
                    <div className="bg-gradient-to-br from-emerald-700 to-slate-900 border border-emerald-500/20 p-5 rounded-3xl h-[170px] flex flex-col justify-between shadow-xl relative overflow-hidden select-none mb-4">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[9px] font-mono text-emerald-200 tracking-wider">APEX UNITED PLATINUM CARD</p>
                          <span className="text-xs font-bold text-white block mt-1 uppercase">{shippingName || 'Fan Member'}</span>
                        </div>
                        <Smartphone className="w-5 h-5 text-emerald-300 opacity-80" />
                      </div>

                      <div>
                        <span className="text-base font-mono text-white tracking-widest block">4000 1234 5678 9024</span>
                        <div className="flex gap-4 text-[9px] font-mono text-slate-400 mt-2">
                          <span>EXP: <strong className="text-white">08/30</strong></span>
                          <span>CVV: <strong className="text-white">***</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Cardholder Name (Matches Recipient)</label>
                        <input 
                          type="text" 
                          required
                          value={shippingName} 
                          onChange={(e) => setShippingName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Simulate Test Card Number</label>
                          <input 
                            type="text" 
                            disabled 
                            value="4000 1234 5678 9024"
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Expiry</label>
                            <input 
                              type="text" 
                              disabled 
                              value="08/30"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono text-center"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase font-bold text-slate-400">CVV Guard</label>
                            <input 
                              type="password" 
                              required 
                              maxLength={3} 
                              placeholder="265"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white text-center font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-850 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        className="text-slate-400 hover:text-white text-xs font-bold font-mono cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                      >
                        Authorize & Pay ${cartTotal.toFixed(2)}
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: OFFICIAL SOVEREIGN INVOICE & RECEIPT (High Quality) */}
                {checkoutStep === 3 && (
                  <div className="space-y-5">
                    
                    {/* Invoice visual design block */}
                    <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-4 font-mono relative overflow-hidden">
                      {/* Side borders resembling standard punch ticket */}
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400"></div>
                      
                      <div className="flex justify-between items-start border-b border-slate-850/60 pb-3">
                        <div>
                          <p className="text-xs font-bold text-white uppercase leading-none">APEX UNITED fanstore</p>
                          <span className="text-[9px] text-slate-500 block mt-1">Sovereign Stadium, Lane 4</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-400 font-bold block">{invoiceId}</span>
                          <span className="text-[8px] text-slate-600 block mt-1">TRANSACTION APPROVED</span>
                        </div>
                      </div>

                      {/* Summary list of jerseys purchased */}
                      <div className="space-y-2.5 text-xs">
                        {cart.map((item, idx) => {
                          const config = KIT_CONFIGS[item.customization.kitType];
                          return (
                            <div key={idx} className="flex justify-between text-[11px] text-slate-300">
                              <div className="truncate pr-4">
                                <span>{item.quantity}x {item.customization.size} {config.name}</span>
                                <span className="block text-[9px] text-slate-500 italic font-sans">
                                  Print: {item.customization.customName} (#{item.customization.customNumber})
                                </span>
                              </div>
                              <span className="text-white shrink-0 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Recipient summary info details */}
                      <div className="pt-3 border-t border-slate-850/60 text-[10px] space-y-1 text-slate-450 border-dashed">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Deliver To:</span>
                          <strong className="text-slate-350">{shippingName}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Address:</span>
                          <span className="text-slate-350 truncate max-w-[200px]">{shippingAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Method:</span>
                          <span className="text-emerald-400 font-bold">Express Air Courier (Free)</span>
                        </div>
                      </div>

                      {/* Barcode representation */}
                      <div className="pt-4 border-t border-slate-850/40 flex flex-col items-center justify-center space-y-1 select-none">
                        <div className="h-7 w-4/5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-around overflow-hidden px-2 opacity-50">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <span 
                              key={i} 
                              className="bg-white h-5 inline-block rounded-xs" 
                              style={{ width: `${(i % 3 === 0 ? 3 : (i % 2 === 0 ? 1 : 2))}px` }}
                            ></span>
                          ))}
                        </div>
                        <span className="text-[8px] text-slate-650">* DIGITAL INVOICE RECEIPT SECURED *</span>
                      </div>
                    </div>

                    {/* Delivery estimations callout */}
                    <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-100">Order successfully queued!</h4>
                        <p className="text-[10px] text-slate-400 leading-normal font-sans">
                          Estimated delivery to your stadium address is set dynamically on <strong>{estDeliveryDate}</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={finalizeAllOrders}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer leading-none"
                      >
                        Conclude Order & Close Window
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* JERSEY SIZE GUIDE DIAGRAM MODAL */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative flex flex-col"
            >
              
              {/* Header */}
              <div className="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-950/50 border border-emerald-900/30 rounded-xl">
                    <Shirt className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                      Athletic Apparel Fit & Size Companion
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Official measurements for elite player & supporter jerseys</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-2 bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-850 hover:text-white rounded-xl cursor-pointer transition-all"
                >
                  <Eye className="w-4 h-4 inline mr-1" /> Close
                </button>
              </div>

              {/* Body Section */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                
                {/* Unit Switch tab & Interactive banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-950/60 p-4 gap-3 rounded-2xl border border-slate-850/60">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 block">MEASUREMENT CONVERSION</span>
                    <p className="text-xs text-slate-300 leading-normal">Switch between imperial inches and metric units.</p>
                  </div>
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setMeasurementUnit('cm')}
                      className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex-1 sm:flex-none text-center ${
                        measurementUnit === 'cm'
                          ? 'bg-emerald-600/15 border border-emerald-800/40 text-emerald-400 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Centimeters (cm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMeasurementUnit('inches')}
                      className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex-1 sm:flex-none text-center ${
                        measurementUnit === 'inches'
                          ? 'bg-emerald-600/15 border border-emerald-800/40 text-emerald-400 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Inches (in)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left part: Measure Vector Diagram */}
                  <div className="md:col-span-5 bg-slate-950/50 rounded-2xl p-4 border border-slate-850/70 flex flex-col items-center">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">How to Measure Fabric</span>
                    
                    {/* SVG diagram illustrating measurement chest & length points */}
                    <div className="w-[180px] aspect-square relative my-1">
                      <svg viewBox="0 0 200 200" className="w-full h-full text-slate-400">
                        {/* Outlined jersey jacket vector silhouette */}
                        <path 
                          d="M60,40 L140,40 L160,80 L140,110 L145,175 L55,175 L60,110 L40,80 Z" 
                          fill="none" 
                          stroke="#334155" 
                          strokeWidth="2.5" 
                          strokeLinejoin="round" 
                        />
                        {/* V neck line collar */}
                        <path d="M85,40 Q100,55 115,40" fill="none" stroke="#334155" strokeWidth="2" />

                        {/* Chest Width Measurement marker */}
                        <g opacity="0.85">
                          <line x1="58" y1="100" x2="142" y2="100" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                          <circle cx="58" cy="100" r="3" fill="#10b981" />
                          <circle cx="142" cy="100" r="3" fill="#10b981" />
                          <rect x="75" y="88" width="50" height="15" fill="#0f172a" rx="4" stroke="#10b981" strokeWidth="1" />
                          <text x="100" y="99" textAnchor="middle" fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="monospace">A: CHEST</text>
                        </g>

                        {/* Torso length marker */}
                        <g opacity="0.85">
                          <line x1="100" y1="40" x2="100" y2="175" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                          <circle cx="100" cy="40" r="3" fill="#f59e0b" />
                          <circle cx="100" cy="175" r="3" fill="#f59e0b" />
                          <rect x="75" y="115" width="50" height="15" fill="#0f172a" rx="4" stroke="#f59e0b" strokeWidth="1" />
                          <text x="100" y="126" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace">B: LENGTH</text>
                        </g>
                      </svg>
                    </div>

                    <div className="space-y-2 mt-2 w-full text-[10px] font-sans text-slate-450 leading-relaxed">
                      <p>
                        <strong className="text-emerald-400 font-mono block">A. Chest Width:</strong> Lay jersey flat, measure horizontally across chest from armpit to armpit.
                      </p>
                      <p>
                        <strong className="text-amber-400 font-mono block mt-1.5">B. Back Length:</strong> Measure vertically from top point of shoulder down to bottom hemline edge.
                      </p>
                    </div>
                  </div>

                  {/* Right part: Measurements Grid table */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="overflow-x-auto rounded-xl border border-slate-850">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950 text-[10px] font-mono uppercase text-slate-500 border-b border-slate-850">
                            <th className="p-3">Size Selection</th>
                            <th className="p-3">A: Chest Width</th>
                            <th className="p-3">B: Back Length</th>
                            <th className="p-3">Avg. Height</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850/60 font-mono text-xs">
                          {[
                            { label: 'XS', chestCm: '46 cm', chestIn: '18 in', lengthCm: '67 cm', lengthIn: '26.5 in', heightCm: '160-165 cm', heightIn: "5'3\"-5'5\"" },
                            { label: 'S', chestCm: '49 cm', chestIn: '19.5 in', lengthCm: '70 cm', lengthIn: '27.5 in', heightCm: '165-172 cm', heightIn: "5'5\"-5'8\"" },
                            { label: 'M', chestCm: '52 cm', chestIn: '20.5 in', lengthCm: '72 cm', lengthIn: '28.5 in', heightCm: '172-180 cm', heightIn: "5'8\"-5'11\"" },
                            { label: 'L', chestCm: '56 cm', chestIn: '22 in', lengthCm: '75 cm', lengthIn: '29.5 in', heightCm: '180-188 cm', heightIn: "5'11\"-6'2\"" },
                            { label: 'XL', chestCm: '60 cm', chestIn: '23.5 in', lengthCm: '77 cm', lengthIn: '30.5 in', heightCm: '188-195 cm', heightIn: "6'2\"-6'5\"" },
                            { label: 'XXL', chestCm: '64 cm', chestIn: '25 in', lengthCm: '80 cm', lengthIn: '31.5 in', heightCm: '195-202 cm', heightIn: "6'5\"-6'8\"" }
                          ].map((item) => {
                            const isCurrent = size === item.label;
                            return (
                              <tr 
                                key={item.label}
                                className={`transition-colors ${
                                  isCurrent 
                                    ? 'bg-emerald-950/20 text-emerald-400 font-bold border-l-2 border-emerald-500' 
                                    : 'hover:bg-slate-950/30 text-slate-350'
                                }`}
                              >
                                <td className="p-3 flex items-center gap-1.5">
                                  <span>{item.label}</span>
                                  {isCurrent && (
                                    <span className="text-[8px] font-sans font-extrabold bg-emerald-600 text-white px-1 py-0.5 rounded uppercase tracking-wider">
                                      Active
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-slate-200">
                                  {measurementUnit === 'cm' ? item.chestCm : item.chestIn}
                                </td>
                                <td className="p-3 text-slate-200">
                                  {measurementUnit === 'cm' ? item.lengthCm : item.lengthIn}
                                </td>
                                <td className="p-3 text-slate-400 text-[11px]">
                                  {measurementUnit === 'cm' ? item.heightCm : item.heightIn}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pro Tip Callout banner */}
                    <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-850/60 flex items-start gap-3">
                      <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-slate-200 block">Apex Athletic Fabric Tech</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Apex supporter jerseys feature a regular athletic fit. If you prefer a loose streetwear or relaxed casual style profile, we highly recommend choosing <strong className="text-emerald-400">one size larger</strong> than normal.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Close controls */}
              <div className="p-6 border-t border-slate-850 bg-slate-950/40 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Apply Fit Selection
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INTERACTIVE JERSEY ORDER EDITOR MODAL FORM */}
      <AnimatePresence>
        {editingOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl relative flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-950/50 border border-emerald-900/30 rounded-xl">
                    <Edit className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-sans">
                      Jersey Order Editor System
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">Modifying Order Ref: {editingOrder.id}</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="p-1.5 bg-slate-950 text-slate-400 border border-slate-850 rounded-lg hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveEditedOrder} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                
                {/* Shipping info */}
                <div className="space-y-3 p-4 bg-slate-950/40 border border-slate-850/60 rounded-2xl">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    1. Shipping & Customer Details
                  </span>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={editShippingName}
                      onChange={(e) => setEditShippingName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Street Address</label>
                    <input
                      type="text"
                      required
                      value={editShippingAddress}
                      onChange={(e) => setEditShippingAddress(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Email Address</label>
                      <input
                        type="email"
                        required
                        value={editShippingEmail}
                        onChange={(e) => setEditShippingEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Phone</label>
                      <input
                        type="text"
                        required
                        value={editShippingPhone}
                        onChange={(e) => setEditShippingPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Print modifications */}
                <div className="space-y-3 p-4 bg-slate-950/40 border border-slate-850/60 rounded-2xl">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    2. Print & Engraving Customization
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Print Nameplate</label>
                      <input
                        type="text"
                        maxLength={12}
                        value={editPrintName}
                        onChange={(e) => setEditPrintName(e.target.value.toUpperCase())}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500 uppercase"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Print Number</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={editPrintNumber}
                        onChange={(e) => setEditPrintNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 block font-sans">
                    Admin Notice: Custom prints will update the tailoring workshop blueprints dynamically.
                  </span>
                </div>

                {/* Status selector */}
                <div className="space-y-2 p-4 bg-slate-950/40 border border-slate-850/60 rounded-2xl">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    3. Order Progress Status
                  </label>
                  <select
                    value={editOrderStatus}
                    onChange={(e) => setEditOrderStatus(e.target.value as OrderStatus)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Tailoring">Active Tailoring Workshop</option>
                    <option value="Printing Nameplate">Printing Plate & Press</option>
                    <option value="Ready to Dispatch">Ready to Dispatch</option>
                    <option value="Shipped">Shipped with Courier</option>
                    <option value="Delivered">Delivered Successfully</option>
                  </select>
                </div>

                {/* Form Footer */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    className="px-4 py-2 bg-slate-950 border border-slate-850 text-xs font-bold text-slate-400 rounded-xl hover:text-white transition-colors cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Commit & Save Variables
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

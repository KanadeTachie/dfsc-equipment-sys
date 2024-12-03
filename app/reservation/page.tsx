"use client"

import React, { useContext, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useUser from '@/app/hook/useUser'
import { useQueryClient } from '@tanstack/react-query'
import { ClipboardCheckIcon, ClipboardX, Trash } from 'lucide-react'
import CartContext, { CartItem, Cart } from "@/app/equipmentpage/cartContext";
import { supabase } from '@/config/supabaseClient'

// type itemType = {
//   id: string;
//   name: string;
//   image: string;
//   stock: number;
//   quantity: number;
//   borrowDate: string;
//   returnDate: string;
// };


const Reservation: React.FC = () => {

  const { isFetching, data } = useUser();
  const queryClient = useQueryClient();

  const { addItemToCart, deleteItemFromCart, cart } = useContext(CartContext);

  const increaseQty = (cartItem: CartItem) => {
    const newQty = cartItem?.quantity + 1;
    const item = { ...cartItem, quantity: newQty };

    if (newQty > Number(cartItem.stock)) return;

    addItemToCart(item);
  };

  const decreaseQty = (cartItem: CartItem) => {
    const newQty = cartItem?.quantity - 1;
    const item = { ...cartItem, quantity: newQty };

    if (newQty <= 0) return;

    addItemToCart(item);
  };

  //console.log("1 item in the cart: ", cart)

  // const [formData, setFormData] = useState<FormData>({
  //   name: '',
  //   studentNumber: '',
  //   degreeProgram: '',
  //   project: '',
  //   adviser: '',
  // });

  const [name, setName] = useState('');
  const [studno, setStudNo] = useState('');
  const [degree, setDegree] = useState('');
  const [project, setProject] = useState('');
  const [adviser, setAdviser] = useState('');
  const [error, setError] = useState<string | null>(null);
  // input values from session:
  useEffect(() => {
    if(data) {
        // if (!data) throw new Error('No user logged in');
        // if (error) throw error;
        //console.log('setting...')
        setName((data?.name) ? data.name : '-');
        setStudNo((data?.email) ? data.email : '-');
        setProject((data?.organization) ? data.organization : '-');
        setDegree((data?.degprog) ? data.degprog : '');
    } else if(error) {
        setError(error);
    }
}, [data]);

  const [cartData, setCartData] = useState(cart.cartItems.map((item) => ({
    ...item,
  })))

  //BORROW AND RETURN DATE ATTEMPT
  const [borrowDate, setBorrowDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  // useEffect
  
  //console.log("item in the cart: ", cart)
  
  const handleCartInputChange = (index: number, field: keyof CartItem, value: string) => {
    const newCartData : any[] = [...cart.cartItems]
    newCartData[index][field] = value
    setCartData(newCartData)
  }
  
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { id, value } = e.target;
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [id]: value,
  //   }));
  // };

  const handleSubmit = async () => {
    try {
      console.log("submitting...")

      const reservationform = {
        name,
        borrower_id: (data?.id),
        email: studno,
        degree,
        project,
        adviser,
        created_at: new Date(),
      }

      
      // Insert borrower data
      const { data: borrowerData, error: borrowerError } = await 
        supabase.from('reservationform')
        .insert([reservationform]).select();
      
      if (borrowerError) throw borrowerError;
      
      
      console.log("rervationform:", reservationform)

      const reservationID = borrowerData[0].id;

      // Prepare cart items data
      const cartItems = cartData.map((item) => ({
        borrower_id: (data?.id),
        reservation_id: reservationID,
        eq_id: item.id,
        image: item.image,
        eqname: item.name,
        quantity: item.quantity,
        borrow_date: borrowDate,
        return_date: returnDate,
      }));

      console.log('cart: ', cartItems)

      // Insert cart items data
      const { data: cartItemsData, error: cartItemsError } = await 
        supabase.from('cart_items')
        .insert(cartItems);

      console.log('cart: ', cartItemsData)
      if (cartItemsError) throw cartItemsError;

      // // Handle success (e.g., show a success message or redirect)
      // console.log('Checkout successful', { borrowerData, cartItemsData });
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Checkout failed', error);
    }
  };

  

  

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:pt-20">
      <div className="space-y-8 pt-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{cart?.cartItems?.length} Items in Cart</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            Review your cart and complete your rental order.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Equipment in Cart</h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Equipment</dt>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</dt>
                {/* <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Borrow Date</dt>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Return Date</dt> */}
              </div>

              {
                cart?.cartItems?.map((cartItem: CartItem, index: number) => (
                  <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6" key={index}>
                    <dd className="text-sm text-gray-900 dark:text-gray-100">{cartItem.name}</dd>
                    <div className="flex items-center">
                        <Button className=" sm:mt-0 bg-[#9B151E]" size={"sm"} data-action="decrement" onClick={() => decreaseQty(cartItem)}>-</Button>
                        <Input 
                          className="text-center mx-3 w-10 text-gray-900 dark:text-gray-50 font-medium" 
                          name="custom-input-number"  
                          value={cartItem.quantity}
                          readOnly 
                        /> 
                        <Button className=" sm:mt-0 bg-[#9B151E]" size={"sm"} data-action="increment" onClick={() => increaseQty(cartItem)}>+</Button>
                        <Button className=" ml-5 sm:mt-0 bg-[#9B151E]" size={"sm"} data-action="increment" onClick={() => deleteItemFromCart(cartItem?.id)}>
                          <Trash className='w-3'/>
                        </Button>
                    </div>
                    {/* <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Input
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              type="datetime-local"
                              value={(cartItem.borrowDate || '').toString().substring(0, 16)}
                              onChange={(e) => handleCartInputChange(index, 'borrowDate', e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              type="datetime-local"
                              value={cartItem.returnDate}
                              onChange={(e) => handleCartInputChange(index, 'returnDate', e.target.value)}
                          />
                        </div>

                    </div> */}
                  </div>
                  )
                ) 
              }
              
            </dl>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Borrower Information</h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">
                  Name
                </Label>
                <Input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="student-number">
                  Email
                </Label>
                <Input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  id="student-number"
                  name='studno'
                  type="email"
                  value={studno}
                  onChange={(e) => setStudNo(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="degree-program">
                  Degree Program
                </Label>
                <Input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  id="degree-program"
                  name='degree'
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="project">
                  Project
                </Label>
                <Input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  id="project"
                  name='project'
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="adviser">
                Adviser
              </Label>
              <Input
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                id="adviser"
                name='adviser'
                type="text"
                value={adviser}
                onChange={(e) => setAdviser(e.target.value)}
              />
            </div>


             {/* RESERVATION DURATION */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Reservation Duration</h2>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">
                      Borrow Date
                    </Label>
                    <Input
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        type="datetime-local"
                        value={borrowDate}
                        onChange={(e) => setBorrowDate(e.target.value)}
                    />                
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">
                      Return Date
                    </Label>
                    <Input
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        type="datetime-local"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>


            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:flex sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center">
                <ClipboardCheckIcon className="h-5 w-5 text-green-500" />
                <span className="ml-2 text-sm font-medium text-green-500">Certified to Use</span>
              </div>
              <div className="flex items-center">
                <ClipboardX className="h-5 w-5 text-red-500" />
                <span className="ml-2 text-sm font-medium text-red-500">Permit to Use</span>
              </div>
              <Button className="mt-4 sm:mt-0 bg-[#9B151E]" onClick={handleSubmit}>Complete Checkout</Button>
            </div>
          </div>
        </div>

       

      </div>
    </div>
  )
}

export default Reservation
import React,{useState} from 'react';
import {MILLISECONDS_PY} from '../../config';
import Transaction from './Transaction';
import {Button} from 'react-bootstrap';
function ToggleTransactionDisplay({block}){
    const [displayTransaction,setDisplayTransaction]=useState(false);
    const {data}=block;
    
    function toggleDiaplyTransaction(){
        setDisplayTransaction(!displayTransaction);
    }
    
    
    if(displayTransaction){
    
       return(<div>
        
                <hr />
                <Transaction transaction={data}/>
                <div>Product Id: {data['product_id']}</div>                
                {data['product_name']?<div>Product Name: {data['product_name']}</div>:null}
                {data['product_details']?<div>Product Details: {data['product_details']}</div>:null}
                {data['transport_details']?<div>Transport Detaails: {data['transport_details']}</div>:null}
           
       
        <br></br>
        <Button variant="danger" size="sm" onClick={toggleDiaplyTransaction} style={{marginBottom:"20px"}}>Show Less</Button>
    </div>) 

    }
    return (
        <div>
            <br></br>
            <Button variant="danger" size="sm" onClick={toggleDiaplyTransaction} style={{marginBottom:"20px"}}>Show more</Button>
        </div>
    )
}
function Block({block}){
    const {timestamp,hash,data}=block;
    const hashDisplay=`${hash.substring(0,15)}...`;
    const timestampDisplay=new Date(timestamp/MILLISECONDS_PY).toLocaleString();
      
    return <div className="Block">
               <div>Hash:{hashDisplay}</div>
               <div>Timestamp:{timestampDisplay}</div>
               <ToggleTransactionDisplay block={block}/>
    </div>

}

export default Block;
import React from 'react';
function Transaction({transaction}){
    const {sent_to,sent_by}=transaction;
    
    return (
        <div className="Transaction">
            <div>From:{sent_by}</div>
         
                <div>
                    To:{sent_to}
                </div>
    
        </div>
    );


}
export default Transaction;
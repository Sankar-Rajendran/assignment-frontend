import React,{} from 'react';


const Table = ({columns, rows, component, callback, deleteRow}) => {


    const renderScanDetails = () => {
        return rows.map((item,index)=>{
                return (
            <tr key={`${index}-${item.name}`}>
                <td>{index+1}</td>
                <td>{item.name}</td>
                <td>{item.scanAmount}</td>
                <td>{item.discount}</td>
                <td>{item.totalAmount}</td>
                <td onClick={()=>deleteRow(index)} className="pointer">Delete</td>
            </tr>
                )
            })
    }


    const renderAppointmentDetails = () => {
        return(
            rows.map((item,index)=>{
                return (
            <tr key={`${index}-${item.name}`}>
                <td>{index+1}</td>
                <td>{item.patientName}</td>
                <td>{`${item.age}-${item.gender}`}</td>
                <td>{item.appointmentDate}</td>
                <td>{item.balanceAmount}</td>
                <td className="cursor" onClick={()=>callback(item.billingID)}>Click to Pay</td>
            </tr>
                )
            })
          
        )
    }

    const renderBillingDetails = () => {
        return rows.map((item,index)=>{
                return (
            <tr key={`${index}-${item.name}`}>
                <td>{index+1}</td>
                <td>{item.paymentDate}</td>
                <td>{item.paymentAmount}</td>
                <td>{item.paymentMethod}</td>
            </tr>
                )
            })   
    }


    const renderTableTows = ()=>{
        if(component === "scan"){
            return renderScanDetails();
        }else if(component === "appointments"){
            return renderAppointmentDetails();
        }else{
            return renderBillingDetails();
        }
    }

  return(
    <table>
      <thead>  
        <tr>            
        <th>Sno</th>
        {
            columns.map((column,index)=>(
               <th key={`${index}-${column}`}>{column}</th>
            ))
        } 
      </tr></thead>
      <tbody>
        {
          rows.length === 0 ? <tr><td colSpan={columns.length+1}>No Data Found</td></tr> : renderTableTows()           
        }
      </tbody>     
    </table>
  )
}


export default Table;
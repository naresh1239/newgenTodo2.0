import React,{memo} from 'react'
import './Style.css'
import { FaTrashAlt } from "react-icons/fa";
import { FaRegCheckSquare } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
interface TODO{
  id : number,
  value : string,
  Date : string,
  Status : boolean
 }
 type ItemArray = TODO[];

// Define the props interface
interface MyComponentProps {
  items: ItemArray;
  deleteOneTodo : (IndexOfTodo : number)=>void;
  IsCompleted : (IndexOfTodo : number)=>void;
  editOneTodo : (IndexOfTodo : number)=>void;
}
const ShowList: React.FC<MyComponentProps> = ({items,deleteOneTodo,IsCompleted,editOneTodo}) => {

  console.log(items)
  return (
    <div>
       <table className="table">
              <thead>
                <tr>
                  <th>Num</th>
                  <th className="w-50">Task</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody id="tasksBody">
              {
      items?.length > 0 ?
      items.map((item,index)=>{
         return <tr>
         <th className={item.Status ? "wavy" : ''}>{index + 1}</th>
         <th className={item.Status ? "wavy" : ''}>{item.value}</th>
         <th className={`${item.Status && 'wavy' } task-date d-flex justify-content-center`}><span>{item.Date}</span></th>
         <th>
           <span onClick={()=>IsCompleted(item.id)} style={{cursor : 'pointer'}}>{item.Status ?  <FaCheckSquare/> : <FaRegCheckSquare/> }</span>
         </th>
         <th>{!item.Status && <i onClick={()=>editOneTodo(item.id)} className="fa-solid fa-trash-can"><CiEdit /></i>}</th>
         <th><i onClick={()=>deleteOneTodo(item.id)} className="fa-solid fa-trash-can"><FaTrashAlt /></i></th>
       </tr>
        })
        : <p>Todo List is Empty</p>
      }
              </tbody>
            </table>
    </div>
  )
}

export default memo(ShowList)
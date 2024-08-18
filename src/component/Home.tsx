import React,{useState,ChangeEvent,useRef,KeyboardEvent,useCallback, useEffect} from 'react'
import ShowList from "./ShowList"
import Swal from 'sweetalert2'
import './Style.css'

const Home: React.FC = () => {
    interface TODO{
     id : number,
     value : string
     Date : string,
     Status : boolean
    }
    const [InputValue, setInputValue] = useState<string>('')
    const [TodoList,setTodoList] = useState<TODO[]>(()=>{
      const saved = localStorage.getItem("TodoList")
      if(saved){
       const initialValue = JSON.parse(saved);
       return initialValue;
      }else{
       return [];
      }
      });
    const [ShowTODOList, setShowTODOList] = useState<TODO[]>([])
    const Inputref = useRef<HTMLInputElement>(null)
    const [EditRowIndex, setEditRowIndex] = useState<number | null>(null)
    const [searchInputval, setsearchInputval] = useState<string>('')
    const [filterType, setfilterType] = useState('Total')

    const setvaluefn = ()=>{
      if(InputValue?.length < 1){
        return Swal.fire({
          position: "center",
          icon: "warning",
          title: "Please Enter Someting To Save!",
          showConfirmButton: false,
          timer: 1500
        });
       }
      const obj = {
         id : Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
         value : InputValue,
         Date : new Date().toDateString(),
         Status : false
      }
      
    setTodoList((perv)=> [...perv, obj])
    setInputValue('')
    if (Inputref.current) {
        Inputref.current.focus();
      }
    }
    
  useEffect(
    () => {
        setShowTODOList([...TodoList])
    },
    [TodoList],
  )
  
  useEffect(() => {
    localStorage.setItem("TodoList", JSON.stringify(TodoList));
  }, [TodoList])
  

   const inputChangeFN = (e: ChangeEvent<HTMLInputElement>)=>{
        const {value} = e.target
        setInputValue(value)
   } 
    
   const inputKeyDownFn = (e: KeyboardEvent<HTMLInputElement>)=>{
     if(e.keyCode == 13){
        if(EditRowIndex){
            editSaveFn()
        }else{
            setvaluefn()
        }
     }
   }

   const deleteTODObyID = (IndexOfTodo : number)=>{
    setTodoList((perv)=> perv.filter((item)=> item.id != IndexOfTodo))
   }
 
   const editOneTodo = useCallback((IndexOfTodo : number)=>{
    setEditRowIndex(IndexOfTodo)
    if(TodoList?.length > 0){
      const currentTodo =  TodoList.find((item)=> item.id == IndexOfTodo)
        if(currentTodo){
            setInputValue(currentTodo?.value)
        }
    }
  
   },[TodoList])
 
   const editSaveFn = ()=>{
    setTodoList((perv)=> perv.map((item)=> {
        if(item.id == EditRowIndex){
          return {...item, value : InputValue}
        }else{
            return item
        }
    }))
    setEditRowIndex(null)
    setInputValue('')
   }

   const IsCompleted = useCallback((IndexOfTodo : number)=>{
    setTodoList((perv)=> perv.map((item)=> {
        if(item.id == IndexOfTodo){
          return {...item, Status : !item.Status}
        }else{
            return item
        }
    }))
   },[TodoList])

   const deleteOneTodo = useCallback((IndexOfTodo : number ) =>{
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
         deleteTODObyID(IndexOfTodo)
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
   },[TodoList])

   const inputChangeSearchFN = (e: ChangeEvent<HTMLInputElement>)=>{
    const {value} = e.target
    setsearchInputval(()=>value)
    if(value){
      const filtedItems = TodoList.filter((item)=> item.value.toLowerCase().includes(value.toLowerCase()))
        setShowTODOList(()=>filtedItems)
    }else{
        setShowTODOList([...TodoList])
    }
   
   }

    const FilterFn = (types : string)=>{
        setfilterType(types)
        if(types == 'Total'){
            setShowTODOList([...TodoList])
        }else if(types == 'Pendings'){
            setShowTODOList([...TodoList])
            setShowTODOList((perv)=> perv.filter((item)=> item.Status == false))
        }else if(types == 'Completed'){
            setShowTODOList([...TodoList])
            setShowTODOList((perv)=> perv.filter((item)=> item.Status == true))
        }     
    }
    
  return (
    <div>
        <>
        <div className="to-do-list-tasks p-5">
            <div className="title text-center">
              <h1 className="fw-bold">To-do list</h1>
              <p id="tasksInfo" className="fw-bold"></p>
            </div>
       </div>
       <div className="input-group mb-3">
        <div>
        <input 
          id="taskInput"
          type="text"
          className="form-control"
          placeholder="Add your task ..."
          aria-label="Add your task"
          aria-describedby="button-addon2"
          ref={Inputref} value={InputValue}
         onChange={inputChangeFN}
          onKeyDown={inputKeyDownFn}/>
      {
        EditRowIndex ?  <button style={{cursor : 'pointer'}} onClick={editSaveFn}>Edit Save</button>
        : <button style={{cursor : 'pointer'}} onClick={setvaluefn}>Add</button>
      }
        </div>
       <div>
       <input 
          id="taskInput"
          type="text"
          className="form-control"
          placeholder="search..."
          aria-label="Add your task"
          aria-describedby="button-addon2"
          value={searchInputval}
         onChange={inputChangeSearchFN}
         />
       </div>
        </div>
        <div className='filters'>
        <input type="radio" id="age1" name="age" value="30" checked={filterType === 'Total'} onClick={()=>FilterFn('Total')}/>
         <label htmlFor="age1">Total , {TodoList?.length}</label><br/>
         <input type="radio" id="age2" name="age" value="60" checked={filterType === 'Pendings'} onClick={()=>FilterFn('Pendings')}/>
         <label htmlFor="age2">Pendings , {TodoList?.filter((item)=>item.Status == false)?.length}</label><br/>  
         <input type="radio" id="age3" name="age" value="100" checked={filterType === 'Completed'} onClick={()=>FilterFn('Completed')}/>
         <label htmlFor="age3">Completed , {TodoList?.filter((item)=>item.Status == true)?.length}</label><br/>
        </div>
        </>
        <div className='list'>
         <ShowList items={ShowTODOList} deleteOneTodo={deleteOneTodo} IsCompleted={IsCompleted} editOneTodo={editOneTodo}/>
        </div>
    </div>
  )
}

export default Home
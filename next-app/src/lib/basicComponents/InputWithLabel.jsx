import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { Textarea } from '@/components/ui/textarea'

export default function InputWithLabel({ inputType, labelText, datafield, inputValue, dataSetter }) {
  const handleChange = (e) => {
    dataSetter((prevInputValue) => {
      return { ...prevInputValue, [datafield]: e.target.value }
    })
  }

  return (
    <>
      <Label htmlFor={datafield}>{labelText}</Label>
      {inputType === 'textarea' && (
        <Textarea id={datafield} value={inputValue[datafield]} onChange={handleChange} required />
      )}
      {inputType === 'text' && (
        <Input type={'text'} id={datafield} value={inputValue[datafield]} onChange={handleChange} required />
      )}
      {inputType === 'number' && (
        <Input type={'number'} id={datafield} value={inputValue[datafield]} onChange={handleChange} required />
      )}
      {inputType === 'date' && (
        <Input type={'date'} id={datafield} value={inputValue[datafield]} onChange={handleChange} required />
      )}
      {inputType === 'password' && (
        <PasswordInput id='password' value={inputValue[datafield]} onChange={handleChange} />
      )}
    </>
  )
}

import PropTypes from 'prop-types'
// import { useLocation } from 'react-router-dom'
// import Button from './Button'

const Header = ({ title, onAdd, showAdd }) => {
//   const location = useLocation()

return (
  // <header className='header'>
    <h1>{title}</h1>
  // </header>
)
}

Header.defaultProps = {
  title: 'Bitcoin Prediction',
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
}

// CSS in JS
// const headingStyle = {
//   color: 'red',
//   backgroundColor: 'black',
// }

export default Header
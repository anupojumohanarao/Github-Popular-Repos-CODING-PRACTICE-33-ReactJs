// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {languageFilterItemDetails, isActive, setActiveLanguageBtn} = props
  const {id, language} = languageFilterItemDetails
  const mainBtnClass = isActive
    ? 'language-btn active-language-btn'
    : 'language-btn'

  const onClickLanguageBtn = () => {
    setActiveLanguageBtn(id)
  }

  return (
    <li>
      <button
        className={mainBtnClass}
        onClick={onClickLanguageBtn}
        type="button"
      >
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem

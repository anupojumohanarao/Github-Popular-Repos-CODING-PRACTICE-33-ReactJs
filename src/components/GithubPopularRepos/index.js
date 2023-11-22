import {Component} from 'react'

import Loader from 'react-loader-spinner'

import RepositoryItem from '../RepositoryItem'
import LanguageFilterItem from '../LanguageFilterItem'

import './index.css'

const mainApiResultsListSection = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

// Write your code here

class GithubPopularRepos extends Component {
  state = {
    mainApiStatus: mainApiResultsListSection.initial,
    repositoryData: [],
    activeLanguageFilterId: languageFiltersData[0].id,
  }

  componentDidMount() {
    this.getTotalRepository()
  }

  getTotalRepository = async () => {
    const {activeLanguageFilterId} = this.state
    this.setState({
      mainApiStatus: mainApiResultsListSection.inProgress,
    })
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFilterId}`
    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedFetchData = fetchedData.popular_repos.map(eachRepo => ({
        id: eachRepo.id,
        name: eachRepo.name,
        avatarUrl: eachRepo.avatar_url,
        starsCount: eachRepo.stars_count,
        forksCount: eachRepo.forks_count,
        issuesCount: eachRepo.issues_count,
      }))
      this.setState({
        repositoryData: updatedFetchData,
        mainApiStatus: mainApiResultsListSection.success,
      })
    } else {
      this.setState({
        mainApiStatus: mainApiResultsListSection.failure,
      })
    }
  }

  renderLoaderView = () => (
    <div data-testId="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderFailureViewSection = () => (
    <div className="failure-section">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-msg-text">Something Wen Wrong</h1>
    </div>
  )

  renderRepositoryDetailsSection = () => {
    const {repositoryData} = this.state

    return (
      <ul className="repository-list-section">
        {repositoryData.map(eachRepo => (
          <RepositoryItem key={eachRepo.id} mainRepositoryDetails={eachRepo} />
        ))}
      </ul>
    )
  }

  setActiveLanguageBtn = newFilterId => {
    this.setState(
      {activeLanguageFilterId: newFilterId},
      this.getTotalRepository,
    )
  }

  renderLanguageDetailsSection = () => {
    const {activeLanguageFilterId} = this.state

    return (
      <ul className="language-filter-section">
        {languageFiltersData.map(eachLanguageRepo => (
          <LanguageFilterItem
            key={eachLanguageRepo.id}
            isActive={eachLanguageRepo.id === activeLanguageFilterId}
            languageFilterItemDetails={eachLanguageRepo}
            setActiveLanguageBtn={this.setActiveLanguageBtn}
          />
        ))}
      </ul>
    )
  }

  renderTotalRepository = () => {
    const {mainApiStatus} = this.state

    switch (mainApiStatus) {
      case mainApiResultsListSection.success:
        return this.renderRepositoryDetailsSection()
      case mainApiResultsListSection.failure:
        return this.renderFailureViewSection()
      case mainApiResultsListSection.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-list-container">
        <div className="main-list-section-content">
          <h1 className="main-heading">Popular</h1>
          {this.renderLanguageDetailsSection()}
          {this.renderTotalRepository()}
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos

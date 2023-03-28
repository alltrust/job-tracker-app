import Wrapper from "../assets/wrappers/SearchContainer";
import { FormRow, FormRowSelect } from "./Index";
import { useAppContext } from "../context/appContext";

const SearchContainer = () => {
  const {
    search,
    searchStatus,
    statusOptions,
    searchType,
    sort,
    sortOptions,
    handleInputChange,
    isLoading,
    jobTypeOptions,
    clearFilter,
  } = useAppContext();

  const handleSearch = (
    el:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (isLoading) return;
    handleInputChange({ name: el.target.name, value: el.target.value });
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    clearFilter()
  };

  return (
    <Wrapper>
      <form data-testid="test-search-form" onSubmit={submitHandler} className='form' >
        <h4>Search Form</h4>

        <div className="form-center">
          <FormRow
            type="text"
            name="search"
            value={search}
            handleChange={handleSearch}
            labelText="search"
          />
          <FormRowSelect
            labelText="job status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            list={["all", ...statusOptions]}
          />
          <FormRowSelect
            labelText="job type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            list={["all", ...jobTypeOptions]}
          />
          <FormRowSelect
            labelText="sort"
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={sortOptions!}
          />
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
    
            type="submit"
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;

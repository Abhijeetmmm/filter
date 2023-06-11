import React, { useEffect,useState } from "react";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";





import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import Link from "next/link";

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function dashboard() {
  const [lightTheme, updateTheme] = useState(true);
  const theme = useTheme();
  const { data: session } = useSession();
  const [repos, setRepos] = useState([]);
  const [languageFilter, setLanguageFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);

  const tableClass = lightTheme ? "min-w-full divide-y divide-gray-200" : "min-w-full divide-y divide-gray-800";
const headerClass = lightTheme ? "dark:bg-gray-800 bg-gray-50" : "bg-gray-800 text-white";
const evenRowClass = lightTheme ? "bg-white" : "bg-gray-700";
const oddRowClass = lightTheme ? "bg-gray-50" : "bg-gray-600";
const textClass = lightTheme ? "text-gray-500" : "text-gray-300";
const textClass1 = lightTheme ? "text-indigo-500" : "text-green-300";
const header = lightTheme ? "bg-white border-b border-gray-200" : "bg-gray-400 border-b border-gray-200";

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    const accessToken =
      "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";
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
      const response = await axios.get("https://api.github.com/repositories", {
        headers,
      });

      const repos = await Promise.all(
        response.data.map(async (repo) => {
          const repoDetailsResponse = await axios.get(repo.url, { headers });
          const repoDetails = repoDetailsResponse.data;
          return {
            url: repoDetails.html_url,
            name: repoDetails.name,
            author: repoDetails.owner.login,
            language: repoDetails.language || null,
            stars: repoDetails.stargazers_count,
            forks: repoDetails.forks_count,
            created_at: repoDetails.created_at,
          };
        })
      );

      setRepos(repos);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setRepos([]);
    }
  };

  const handleLanguageFilterChange = (event) => {
    setLanguageFilter(event.target.value);
  };

  const handleStartDateFilterChange = (date) => {
    setStartDateFilter(date);
  };

  const handleEndDateFilterChange = (date) => {
    setEndDateFilter(date);
  };

  const filterRepos = (repo) => {
    if (
      languageFilter &&
      repo.language &&
      repo.language.toLowerCase() !== languageFilter.toLowerCase()
    ) {
      return false;
    }

    if (startDateFilter && new Date(repo.created_at) < startDateFilter) {
      return false;
    }

    if (endDateFilter && new Date(repo.created_at) > endDateFilter) {
      return false;
    }

    return true;
  };

  const filteredRepos = repos.filter(filterRepos);
  return (
    

    <>
     <div className="min-h-full">
        <Disclosure as="nav" className={header}>
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <img
                        className="block lg:hidden h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                      />
                      <img
                        className="hidden lg:block h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                        alt="Workflow"
                      />
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <button
                          onClick={() => {
                            theme.setTheme(lightTheme ? "dark" : "light");
                            updateTheme(!lightTheme);
                          }}
                          className="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                        >
                          {!lightTheme ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-amber-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-6 w-6 text-amber-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11.75 3.412a.818.818 0 01-.07.917 6.332 6.332 0 00-1.4 3.971c0 3.564 2.98 6.494 6.706 6.494a6.86 6.86 0 002.856-.617.818.818 0 011.1 1.047C19.593 18.614 16.218 21 12.283 21 7.18 21 3 16.973 3 11.956c0-4.563 3.46-8.31 7.925-8.948a.818.818 0 01.826.404z" />
                            </svg>
                          )}
                        </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                  <button
                          onClick={() => {
                            theme.setTheme(lightTheme ? "dark" : "light");
                            updateTheme(!lightTheme);
                          }}
                          className="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                        >
                          {!lightTheme ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-amber-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-6 w-6 text-amber-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11.75 3.412a.818.818 0 01-.07.917 6.332 6.332 0 00-1.4 3.971c0 3.564 2.98 6.494 6.706 6.494a6.86 6.86 0 002.856-.617.818.818 0 011.1 1.047C19.593 18.614 16.218 21 12.283 21 7.18 21 3 16.973 3 11.956c0-4.563 3.46-8.31 7.925-8.948a.818.818 0 01.826.404z" />
                            </svg>
                          )}
                        </button>
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                        'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                   
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className="py-10">
          
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              {/* Replace with your content */}
              <div className="px-4 py-8 sm:px-0">
              <div className="">
      

      <div className="">
        <div className="flex space-x-4 ">
      <h1 className="text-2xl font-bold text-indigo-500">Trending Repositories</h1>
      {/* {session ? (
        <>
          <p>Signed in as {session.user.email}</p>
          <button onClick={signOut} className="bg-red-500 text-white rounded-md px-4 py-2">Sign out</button>
        </>
      ) : (
        <button onClick={signIn} className="bg-green-500 text-white rounded-md px-4 py-2">Sign in with GitHub</button>
      )} */}
      {session ? (
  <>
    {session.user && (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={signOut} className="bg-red-500 text-white rounded-md px-4 py-2">
          Sign out
        </button>
      </>
    )}
  </>
) : (
  <button onClick={signIn} className="bg-green-500 text-white rounded-md px-4 py-2">
    Sign in with GitHub
  </button>
)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 sm:space-x-3 py-6">
      <div className="sm:col-span-1">
        <input
          type="text"
          value={languageFilter}
          onChange={handleLanguageFilterChange}
          placeholder="Enter Language"
          className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="sm:col-span-1">
        <DatePicker
          selected={startDateFilter}
          onChange={handleStartDateFilterChange}
          placeholderText="Select Start date"
          className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="sm:col-span-1">
        <DatePicker
          selected={endDateFilter}
          onChange={handleEndDateFilterChange}
          placeholderText="Select End date"
          className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>
      

      <div className="flex flex-col py-2">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className={tableClass}>
            <thead className={headerClass}>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Author
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Languages
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stars
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Forks
                </th>
              </tr>
            </thead>
            <tbody>
    {filteredRepos.map((repo, repoIdx) => (
      <tr
        key={repo.email}
        className={repoIdx % 2 === 0 ? evenRowClass : oddRowClass}
      >
        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${textClass1}`}>
          <Link href={repo.url}>{repo.name}</Link>
        </td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}>{repo.author}</td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}>{repo.language}</td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}>{repo.stars}</td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}>{repo.forks}</td>
      </tr>
    ))}
  </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
              </div>
              {/* /End replace */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

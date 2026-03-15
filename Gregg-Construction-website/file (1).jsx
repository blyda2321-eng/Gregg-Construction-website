/**
 * Gregg Construction - Project Context
 */

import React, { createContext, useState, useCallback } from 'react';
import projectService from '../services/projects';
import estimateService from '../services/estimates';

export const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchProjects = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await projectService.getProjects(params);
      setProjects(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchProject = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await projectService.getProject(id);
      setCurrentProject(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createProject = async (projectData) => {
    setLoading(true);
    try {
      const data = await projectService.createProject(projectData);
      setProjects((prev) => [data, ...prev]);
      setCurrentProject(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSelections = useCallback(async (projectId) => {
    try {
      const data = await estimateService.getSelections(projectId);
      setSelections(data.results || data);
    } catch (err) {
      setError(err.message);
    }
  }, []);
  
  const addSelection = async (selectionData) => {
    try {
      const data = await estimateService.addSelection(selectionData);
      setSelections((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  const removeSelection = async (id) => {
    try {
      await estimateService.removeSelection(id);
      setSelections((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  const value = {
    currentProject,
    projects,
    selections,
    loading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    fetchSelections,
    addSelection,
    removeSelection,
    setCurrentProject,
  };
  
  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

import { axiosInstance } from "./instance";
import Endpoints from "./endpoints";

export const login = (params) => axiosInstance.post(Endpoints.LOGIN, params);

export const getRoutes = (params) => axiosInstance.get(Endpoints.GET_ROUTERS , { params });

export const getRoute = (id) => axiosInstance.get(Endpoints.GET_ROUTER + `${id}`);

export const getRouteJson = (params) => axiosInstance.get(Endpoints.GET_ROUTER_JSON, { params });

export const addRoute = (params) => axiosInstance.post(Endpoints.ADD_ROUTER, params);

export const updateRoute = (id, params) => axiosInstance.patch(Endpoints.UPDATE_ROUTER + `${id}`, params);

export const getArchive = () => axiosInstance.get(Endpoints.GET_ARCHIVE );

export const getQuadcopters = (params) => axiosInstance.get(Endpoints.GET_QUADCOPTER , { params });

export const deleteQuadcopters = (id) => axiosInstance.delete(Endpoints.DELETE_QUADCOPTER + `${id}`);

export const updateQuadcopters = (id, params) => axiosInstance.patch(Endpoints.UPDATE_QUADCOPTER + `${id}`, { ...params });

export const addQuadcopters = (params) => axiosInstance.post(Endpoints.ADD_QUADCOPTER, params);

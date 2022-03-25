import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { post } from "../../api";

export const login = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    const response = await post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
    // console.log(response.data.json())
    return response.data;
  }
);

export const userValidate = createAsyncThunk(
  "user/validate",
  async (params, thunkAPI) => {
    const response = await post("/auth/validate");
    return response.data;
  }
);

export const logout = createAsyncThunk("user/logout", async (arg, thunkAPI) => {
  const response = await post("/auth/logout");
  return response.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    logged: false,
    name: "",
    loading: false,
    error: true,
    message: "",
  },
  //Thunks
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.loading = true
      state.error = false
      state.message = ""
      state.name = ""
    });

    builder.addCase(login.rejected, (state, action) => {
      state.logged = false
      state.loading = false;
      state.error = true;
      state.message = action.payload.message;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      console.log(action)
      state.loading = false;
      state.logged = true;
      state.error = false;
      state.name = action.payload.name;
    });

    builder.addCase(userValidate.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(userValidate.fulfilled, (state, action) => {
      state.logged = true;
      state.name =  action.payload?.user?.name
      state.error = false;
    });

    builder.addCase(userValidate.rejected, (state, action) => {
      state.error = true;
      state.logged = false;
      state.message = "Error";
      state.loading = false;
    });

    builder.addCase(logout.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(logout.fulfilled, (state, action) => {
      state.logged = false;
      state.name = "";
      state.error = false;
    });

    builder.addCase(logout.rejected, (state, action) => {
      state.logged = true;
      state.error = true;
      state.message = "Error";
    });
  },
});

// export const { logout } = userSlice.actions;
export default userSlice.reducer;

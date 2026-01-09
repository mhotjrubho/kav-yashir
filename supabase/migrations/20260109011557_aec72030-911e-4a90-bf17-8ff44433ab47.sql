-- Update the handle_new_user function to save all profile data from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    email, 
    first_name, 
    last_name,
    id_number,
    mobile,
    rav_kav_number,
    city,
    street,
    house_number,
    profile_complete
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'id_number',
    NEW.raw_user_meta_data ->> 'mobile',
    NEW.raw_user_meta_data ->> 'rav_kav_number',
    NEW.raw_user_meta_data ->> 'city',
    NEW.raw_user_meta_data ->> 'street',
    NEW.raw_user_meta_data ->> 'house_number',
    COALESCE((NEW.raw_user_meta_data ->> 'profile_complete')::boolean, false)
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;